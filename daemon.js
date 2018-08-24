'use strict';
var path = require('path'),
  config = require(path.resolve('./config/config')),
  nodemailer = require('nodemailer'),
  async = require('async'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Client = require('node-rest-client').Client,
  client = new Client(),
  CronJob = require('cron').CronJob,
  i;


console.log('Your app running on Environment :-', process.env.NODE_ENV);

if (process.env.NODE_ENV == "development") {
  console.log("Its dev environment");
  var host = "http://localhost:";
  // var host = "http://74.208.87.238:";
  var port = process.env.port || 3000;
}

if (process.env.NODE_ENV == "production") {
  console.log("Its production environment");
  var host = "https://www.birthdayheadlines.com:";
  var port = process.env.port || 443;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

var base_uri = host + port;

exports.start = function start(callback) {
  new CronJob('00 00 00 * * *', function() { //will run every day at 12:00 AM    
    // console.log('comes inside');
    getBirthdayReminders(client, function(reminders) {
      console.log('Fetching Reminders:', reminders);

      async.forEach(reminders, function(reminder, callback) {
        getActiveProfessionals(client, reminder.option, function(professionals) {
          console.log('Professionals reminder option', reminder.option);
          console.log('As per the above reminder option the email has to be sent to the following professionals:', professionals);
          if (professionals.length > 0) {
            retrieveProfessionalIds(professionals, function(pids) {
              console.log("The professional ids with above option email has to be sent are", pids);
              if (pids.length > 0) {
                async.forEach(pids, function(pid, callback) {
                  console.log('Professional id:', pid);
                  getCustomersByProfessionalId(client, pid, reminder.message, function(customers) {
                    console.log('Customers celebrating birthday are', customers);

                    if (customers.length > 0) {
                      async.forEach(customers, function(customer, callback) {
                        sendMail(client, customer, reminder.message, function(response) {});
                        // tell async that that particular element of the iterator is done
                        callback();
                      }, function(err) {
                        console.log('Mail sending to all professionals done');
                      });
                    } else {
                      console.log('No customer celebrating birthday for this professional');
                    }
                  });
                  // tell async that that particular element of the iterator is done
                  callback();

                }, function(err) {
                  console.log('Professionals iterating done');
                });
              } else {
                console.log("No professional ids");
              }
            });
          } else {
            console.log("No professional");
          }
        });

        // tell async that that particular element of the iterator is done
        callback(); //Reminder single iteration

      }, function(err) {
        console.log('Reminders iterating done');
      });

    });
  }, null, true, '');
};

function getBirthdayReminders(client, callback) {
  // This method will return an array of professionals or an emrty array if there is no professionals (users) in the db
  var uri = base_uri + '/api/admin/reminders';
  fetchReminders(client, uri, function(reminders) {
    if (reminders.length > 0) {
      callback(reminders);
    } else {
      var uri = base_uri + '/api/admin/populateReminders';
      populateReminders(client, uri, function(reminders) {
        console.log("Reminders were empty and populated now:", reminders);
        callback(reminders);
      });
    }

  });

}

function fetchReminders(client, uri, callback) {

  var reminders = client.get(uri, function(data, response) {
    // console.log(response);
    callback(data);
  });

  reminders.on('requestTimeout', function(req) {
    console.log('request has expired');
    req.abort();
  });

  reminders.on('responseTimeout', function(res) {
    console.log('response has expired');
  });

  // This will handle all the errors
  reminders.on('error', function(err) {
    console.log('request error', err);
  });

}

function populateReminders(client, uri, callback) {


  var reminders = client.get(uri, function(data, response) {
    // console.log(data.reminders.ops);
    // process.exit();
    callback(data.reminders.ops);
  });

  reminders.on('requestTimeout', function(req) {
    console.log('request has expired');
    req.abort();
  });

  reminders.on('responseTimeout', function(res) {
    console.log('response has expired');
  });

  // This will handle all the errors
  reminders.on('error', function(err) {
    console.log('request error', err);
  });

}

function getActiveProfessionals(client, option, callback) {
  // This method will return an array of professionals or an emrty array if there is no professionals (users) in the db
  // console.log('deamon', option);

  var uri = base_uri + '/api/activeProfessionals/' + '${option}';
  var args = {
    path: {
      "option": option
    }
  };
  console.log('uri', uri);
  var professionals = client.get(uri, args, function(data, response) {
    // console.log('Active professionals:', data);
    callback(data);
  });

  professionals.on('requestTimeout', function(req) {
    console.log('request has expired');
    req.abort();
  });

  professionals.on('responseTimeout', function(res) {
    console.log('response has expired');
  });

  //it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts 
  professionals.on('error', function(err) {
    console.log('request error', err);
  });

}

function retrieveProfessionalIds(professionals, callback) {
  var professional_ids = [];
  var i;

  for (i = 0; i < professionals.length; i++) {
    professional_ids.push(professionals[i]._id);
  }

  callback(professional_ids);
}

function retrieveCustomersName(customers, callback) {
  var customer_names = [];
  var i;

  for (i = 0; i < customers.length; i++) {
    customer_names.push(customers[i].firstName);
  }

  callback(customer_names);
}


function getCustomersByProfessionalId(client, pid, description, callback) {
  var uri = base_uri + '/api/customers/' + description + '/professional/' + '${pid}';
  var args = {
    path: {
      "pid": pid
    }
  };

  var customers = client.get(uri, args, function(data, response) {
    callback(data);
  });

  customers.on('requestTimeout', function(req) {
    console.log('request has expired');
    req.abort();
  });

  customers.on('responseTimeout', function(res) {
    console.log('response has expired');
  });

  //it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts 
  customers.on('error', function(err) {
    console.log('request error', err);
  });

}

function sendMail(client, customer, message, callback) {
  console.log()
  var uri = base_uri + '/api/customer/bdayReminder';
  var pemail = customer.user.email; //professional email
  var pname = customer.user.firstName; //Name of the professional
  var cname = customer.firstName; //Name of the customer
  var customerId = customer._id

  var args = {
    parameters: {
      "pemail": pemail,
      "pname": pname,
      "cname": cname,
      "customerId": customerId,
      "message": message
    }
  };

  var mail = client.post(uri, args, function(data, response) {
    // parsed response body as js object 
    // console.log(data);
  });

  mail.on('requestTimeout', function(req) {
    console.log('request has expired');
    req.abort();
  });

  mail.on('responseTimeout', function(res) {
    console.log('response has expired');
  });

  //it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts 
  mail.on('error', function(err) {
    console.log('request error', err);
  });

}