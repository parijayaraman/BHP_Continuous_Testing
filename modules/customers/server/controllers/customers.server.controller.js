'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  Customer = mongoose.model('Customer'),
  Event = mongoose.model('Event'),
  Peak = mongoose.model('Peak'),
  User = mongoose.model('User'),
  Sp500 = mongoose.model('Sp'),
  EmailHistory = mongoose.model('EmailHistory'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  nodemailer = require('nodemailer'),
  math = require('mathjs'),
  async = require('async'),
  winston = require('winston'),
  _ = require('lodash');

const http = require('http');
const imageType = require('image-type');

var smtpTransport = nodemailer.createTransport(config.mailer.options);
const fs = require("fs");
var exporting = require("node-highcharts-exporting");



/**
 * Create a Customer
 */
exports.create = function(req, res) {

  var customer = new Customer(req.body);
  customer.user = req.user;

  Customer.find({
    'firstName': customer.firstName,
    'lastName': customer.lastName,
    'dob': customer.dob,
    'user': req.user._id
  }).exec(function(err, customers) {
    if (customers.length == 0) {
      saveCustomer(customer, res);
    } else {
      return res.status(422).send({
        message: "Customer already exists."
      });
    }
  });
};

function saveCustomer(customer, res) {
  customer.save(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customer);
    }
  });
}

/**
 * Create a Customer
 */
exports.bulkCreate = function(req, res) {
  var importedCount = 0;
  async.forEach(req.body, function(data, callback) {
    importedCount++;
    var customer = new Customer(data);
    customer.dob = data.DOB;
    customer.date = data.date;
    customer.month = data.month;
    customer.year = data.year;

    customer.user = req.user;
    customer.firstName = data['First name'];
    customer.lastName = data['Last name'];
    customer.email = data['Email address'];
    customer.jobTitle = data['Job title'];
    customer.organization = data.Organization;
    if (data.Gender.toLowerCase() === 'm' || data.Gender.toLowerCase() === 'male') {
      customer.gender = 0;
    } else {
      customer.gender = 1;
    }

    Customer.find({
      'firstName': customer.firstName,
      'lastName': customer.lastName,
      'dob': customer.dob,
      'user': req.user._id
    }).exec(function(err, customers) {
      if (customers.length == 0) {
        customer.save(function(err) {
          if (err || importedCount === 2) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }
        }); // tell async that that particular element of the iterator is done
      }
    });

    callback();
  }, function(err) {
    if (req.body.length === importedCount) {
      res.json({
        importedCount: importedCount
      });
    } else {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
  });
};


/**
 * Show the current Customer
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var customer = req.customer ? req.customer.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the 'owner'.
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  customer.isCurrentUserOwner = req.user && customer.user && customer.user._id.toString() === req.user._id.toString();

  res.jsonp(customer);
};

/**
 * Update a Customer
 */
exports.update = function(req, res) {
  var customer = req.customer;
  customer = _.extend(customer, req.body);

  Customer.find({
    'firstName': customer.firstName,
    'lastName': customer.lastName,
    'dob': customer.dob,
    'user': req.user._id
  }).exec(function(err, customers) {
    if (customers.length > 0) {
      if (customers.length === 1 && customer._id.toString() === customers[0]._id.toString()) {
        saveCustomer(customer, res);
      } else {
        return res.status(422).send({
          message: "Customer already exists."
        });
      }
    } else {
      saveCustomer(customer, res);
    }
  });
};

/**
 * Delete an Customer
 */
exports.delete = function(req, res) {
  var customer = req.customer;

  customer.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customer);
    }
  });
};

/**
 * List of Customers
 */
exports.list = function(req, res) {
  Customer.find().sort('-created').populate('user', 'email').exec(function(err, customers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customers);
    }
  });
};

/**
 * Customer middleware
 */
exports.customerByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Customer is invalid'
    });
  }

  Customer.findById(id).populate('user', 'email').exec(function(err, customer) {
    if (err) {
      return next(err);
    } else if (!customer) {
      return res.status(404).send({
        message: 'No Customer with that identifier has been found'
      });
    }
    req.customer = customer;
    next();
  });
};

// Fetch all customers
exports.getProfessionals = function(req, res) {
  User.find({}, function(err, professionals) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(professionals);
    }
  });
};

// Fetch all customers
exports.getActiveProfessionals = function(req, res) {
  User.find({
    isActive: true,
    birthdayReminderMail: req.params.birthdayReminderMail
  }, function(err, professionals) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(professionals);
    }
  });
};

//  Fetch all customers for a professional
exports.getCustomersForProfessional = function(req, res) {
  Customer.find({
    'user': req.params.pid
  }).populate('user', 'email firstName lastName').exec(function(err, customers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customers);
    }
  });
};

//  Fetch all customers for a professional who are celebrating birthday today
exports.todayBirthdays = function(req, res) {

  var today = new Date();
  var date = today.getDate();
  var month = today.getMonth() + 1;
  Customer.find({
    'date': date,
    'month': month,
    'user': req.params.pid
  }).populate('user', 'email firstName lastName').exec(function(err, customers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customers);
    }
  });
};

//  Fetch all customers for a professional who are celebrating birthday tomorrow
exports.tomorrowBirthdays = function(req, res) {

  var today = new Date();
  var date = today.getDate() + 1;
  var month = today.getMonth() + 1;
  Customer.find({
    'date': date,
    'month': month,
    'user': req.params.pid
  }).populate('user', 'email firstName lastName').exec(function(err, customers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customers);
    }
  });
};

//  Fetch all customers for a professional who are celebrating birthday today
exports.getBirthdayCustomers = function(req, res) {
  Customer.find({
    'user': req.user._id
  }).exec(function(err, customers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customers);
    }
  });

};

// Fetch all customers
exports.mailsToday = function(req, res) {
  EmailHistory.find({
    'sentDate': {
      $lt: new Date(),
      $gte: new Date(new Date().setDate(new Date().getDate() - 1))
    }
  }, function(err, mails) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mails);
    }
  });
};

/**
 * Email template to customer POST
 */
exports.sendEmailGreetings = function(req, res, next) {
  async.waterfall([
    function(done) {

      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      var baseUrl = req.app.get('domain') || httpTransport + req.headers.host;
      var templateURL = 'modules/customers/server/templates/customer-birthday-email';

      if (req.body.template === 1) { // template 0 is birthday and 1 is newyear. TODO: Need to define in constant.
        templateURL = 'modules/customers/server/templates/customer-newyear-email';
      }
      res.render(path.resolve(templateURL), {
        customerName: req.body.customerName,
        appName: config.app.title,
        imageUrl: baseUrl + '/images/birthday.png',
        professionalName: req.body.professional,
        currentTime: new Date()
      }, function(err, emailHTML) {
        done(err, emailHTML, req);
      });
    },
    // If valid email, send reset email using service
    function(emailHTML, req, done) {
      var professionalName = req.user.displayName;
      var fromProfessional = "";
      if (professionalName != undefined) {
        fromProfessional = config.mailer.from.replace("BHP-Admin", professionalName);
      }

      var mailOptions = {
        to: req.body.email,
        from: fromProfessional,
        replyTo: req.body.user.email,
        subject: req.body.subject,
        // html: emailHTML
        html: req.body.htmlcontent
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log(err);
        if (!err) {
          res.send({
            message: 'An email is sent to the registered email with further instructions'
          });
          var emailHistory = new EmailHistory();
          emailHistory.sentBy = req.user;
          emailHistory.sentTo = mongoose.Types.ObjectId(req.body._id);
          emailHistory.fromEmail = config.mailer.from;
          emailHistory.toEmail = req.body.email;
          emailHistory.sentDate = new Date();
          emailHistory.subject = req.body.subject;
          emailHistory.content = req.body.htmlcontent;
          emailHistory.type = 'wish';

          emailHistory.save(function(err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              // res.jsonp(customer);
              console.log('Email history saved in our db');
            }
          });

          Customer.findOne({
            _id: mongoose.Types.ObjectId(req.body._id)
          }, function(err, doc) {
            doc.emailSent = true;
            doc.emailSentDate = new Date();
            doc.save();
          });
        } else {
          return res.status(422).send({
            message: 'Failure sending email'
          });
        }

        done(err);
      });
    }
  ], function(err) {
    if (err) {
      return next(err);
    }
  });
};

// Daily Birthday Reminder
exports.sendBirthdayReminder = function(req, res, next) {
  async.waterfall([
    function(done) {

      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }

      var baseUrl = req.app.get('domain') || httpTransport + req.headers.host;
      var greetingUrl = baseUrl + '/customers/' + req.query.customerId + '/greetings';
      var templateURL = 'modules/customers/server/templates/professional-reminder-email';
      var dateObj = new Date();
      var month = dateObj.getUTCMonth() + 1; // months from 1-12
      if (req.query.message == 'today') {
        var day = dateObj.getUTCDate();
      }
      if (req.query.message == 'tomorrow') {
        var day = dateObj.getUTCDate() + 1;
      }
      var year = dateObj.getUTCFullYear();
      var birthDate = month + '/' + day + '/' + year;

      res.render(path.resolve(templateURL), {
        professionalName: req.query.pname,
        customerName: req.query.cname,
        greetingUrl: greetingUrl,
        message: req.query.message,
        birthDate: birthDate
      }, function(err, emailHTML) {
        done(err, emailHTML, req);
      });
    },
    // If valid email, send reset email using service
    function(emailHTML, req, done) {
      var mailOptions = {
        to: req.query.pemail,
        subject: 'Birthday Reminder Email',
        from: config.mailer.from,
        html: emailHTML
      };
      // console.log(mailOptions);
      smtpTransport.sendMail(mailOptions, function(err) {
        if (!err) {
          res.send({
            message: 'An email is sent to the registered email with further instructions'
          });

          var emailHistory = new EmailHistory();
          // emailHistory.sentBy = 'admin';
          emailHistory.sentTo = req.user;
          emailHistory.fromEmail = config.mailer.from;
          emailHistory.toEmail = req.query.pemail;
          emailHistory.sentDate = new Date();
          emailHistory.subject = 'Birthday Reminder Email';
          emailHistory.content = emailHTML;
          emailHistory.type = 'reminder';

          emailHistory.save(function(err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              // res.jsonp(customer);
              console.log('Email history saved in our db');
            }
          });

        } else {
          console.log(err);
          return res.status(422).send({
            message: 'Failure sending email'
          });
        }

        done(err);
      });
    }
  ], function(err) {
    if (err) {
      return next(err);
    }
  });
};

exports.getEventsAndPeaks = function(req, res) {
  var year = parseInt(req.params.year, 10);

  var data = {};
  data.year = year;
  var peaks_default = {
    president: 'N/A',
    vicePresident: 'N/A',
    sp500: 'N/A',
    gainTo: 'N/A',
    gallonOfMilk: 'N/A',
    loafOfBread: 'N/A',
    gallonOfGas: 'N/A',
    newHome: 'N/A',
    newCar: 'N/A',
    wages: "N/A",
    baseball: 'N/A',
    superbowl: 'N/A',
    popularGirl: 'N/A',
    popularBoy: "N/A",
    popularMovie: 'N/A',
    popularActor: 'N/A',
    popularActress: 'N/A',
    populartvShow: 'N/A',
    timePerson: 'N/A',
    chineseYear: 'N/A',
    hipHopMusic: 'N/A',
    popMusic: 'N/A',
    actors_image: "/images/actors/default.png",
    actresses_image: "/images/actresses/default.jpg",
    movies_image: "/images/movies/default.jpg",
    presidents_image: "/images/presidents/default.png",
    vice_presidents_image: "/images/vice_presidents/default.png",
    time_persons_image: "/images/time_persons/default.png",
    cars_image: "/images/cars/default.jpg",
    gas_image: "/images/gas/gallon_of_gas.jpg",
    bread_image: "/images/bread/bread_loaf.jpg",
    milk_image: "/images/milk/quart_of_milk.jpg",
    sp500_chart_path: "/images/sp/default.png"
  };

  var events_default = [{
    eventId: 1,
    event: "N/A",
    event_image: "/images/events/default.png"
  }, {
    eventId: 2,
    event: "N/A",
    event_image: "/images/events/default.png"
  }, {
    eventId: 3,
    event: "N/A",
    event_image: "/images/events/default.png"
  }, {
    eventId: 4,
    event: "N/A",
    event_image: "/images/events/default.png"
  }];


  getEvents(year, function(events) {
    var events = events;
    if (events.length == 0) {
      console.log("Zero length events");
      data.events = events_default;
    } else {
      data.events = events;
    }

    generateChart(year, function(chart) {
      getPeaks(year, function(peaks) {
        var peaks = peaks;
        if (peaks.length == 0) {
          console.log("Zero length peaks");
          data.peaks = peaks_default;
          res.jsonp(data);
        } else {
          data.peaks = peaks[0];
          data.peaks.sp500_chart_path = chart.fileName
          res.jsonp(data);
        }
      });
    });
  });
}

function getEvents(year, callback) {
  Event.find({
    year: year
  }).lean().exec(function(err, events) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      callback(events);
    }
  });
}

function getPeaks(year, callback) {
  Peak.find({
    'year': year
  }).lean().exec(function(err, peaks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log(peaks);
      callback(peaks);
    }
  });
}

function getSp500(birthYear, callback) {
  var currentYear = new Date().getFullYear();
  Peak.find().select("sp500 year").find({
    year: {
      $gt: birthYear - 1,
      $lt: currentYear
    }
  }).exec(function(err, sp) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      callback(sp);
    }
  });
}

function generateChart(birthYear, callback) {
  checkChartExistence(birthYear, function(exists, chart) {
    if (!exists) {
      generateSpChart(birthYear, function(generated) {
        if (generated) {
          saveSpChartPath(birthYear, function(saved, newChart) {
            callback(newChart);
          });
        }
      });
    } else {
      callback(chart);
    }
  });
}

function checkChartExistence(birthYear, callback) {
  var currentYear = new Date().getFullYear().toString();
  Sp500.find({
    startYear: birthYear,
    endYear: currentYear
  }, function(err, chart) {
    if (chart.length > 0) {
      callback(true, chart[0]);
    } else {
      callback(false, []);
    }
  });

}

function generateSpChart(birthYear, callback) {
  var birthYear = birthYear;
  var currentYear = new Date().getFullYear();
  var fileName = birthYear + '_' + currentYear;

  var assetPath = 'public/';
  var imagePath = '/images/sp/' + fileName + '.png';
  var filePath = assetPath + imagePath;

  getSp500(birthYear, function(peaks) {
    var years = [];
    var sps = [];
    var peaks = peaks;
    var peaksCount = peaks.length;

    peaks.forEach(function(peak) {
      years.push(peak.year);
      sps.push(parseInt(peak.sp500));
    });

    exporting({
      data: {
        xAxis: {
          categories: years
        },
        series: [{
          showInLegend: false,
          data: sps
        }]
      },

      options: {
        chart: {
          // backgroundColor: '#FCFFC5' // Yellow
          // backgroundColor: '#808080' // Gray
         // backgroundColor: '#ADD8E6' // Light blue
        },
        title: {
          text: "S&P 500"
        },
        "xAxis": {
          "title": {
            "text": "Year"
          }
        },
        credits: {
          text: 'birthdayheadlines.com',
          href: 'https://www.birthdayheadlines.com'
        },
      }

    }, function(err, data) {
      // data had encode base64 , should be decode
      fs.writeFile(filePath, new Buffer(data, 'base64'), function() {
        console.log('Written to chart.png');
      });
    })
  });
  callback(true);
}

function saveSpChartPath(birthYear, callback) {
  var currentYear = new Date().getFullYear();
  var fileName = birthYear + '_' + currentYear;
  var assetPath = 'public/';
  var imagePath = '/images/sp/' + fileName + '.png';

  var sp500 = new Sp500({
    startYear: birthYear,
    endYear: currentYear,
    fileName: imagePath
  });

  sp500.save(function(err, sp500) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      callback(true, sp500);
    }
  });
}

exports.checkImages = function(req, res) {
  var hostname = req.headers.host; // hostname = 'localhost:3000'

  var years = ['1916', '1917', '1918', '1919', '1920', '1921', '1922', '1923', '1924', '1925', '1926',
    '1927', '1928', '1929', '1930', '1931', '1932', '1933', '1934', '1935', '1936', '1937', '1938',
    '1939', '1940', '1941', '1942', '1943', '1944', '1945', '1946', '1947', '1948', '1949', '1950',
    '1951', '1952', '1953', '1954', '1955', '1956', '1957', '1958', '1959', '1960', '1961', '1962',
    '1963', '1964', '1965', '1966', '1967', '1968', '1969', '1970', '1971', '1972', '1973', '1974', '1975',
    '1976', '1977', '1978', '1979', '1980', '1981', '1982', '1983', '1984', '1985', '1986', '1987', '1988',
    '1989', '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000'
  ];

  var missingImages = [];

  var imageCategory = req.params.imageCategory;
  var fileName = imageCategory + '_missing.csv';

  fs.unlink('public/missingImages/' + fileName, (err) => {
    if (err) throw err;
    console.log('successfully deleted ', fileName);
  });


  years.forEach(function(year) {
    var url = 'http://' + hostname + '/images/' + imageCategory + '/' + year + '.jpg';

    if (imageCategory == 'events') {
      url = 'http://' + hostname + '/images/' + imageCategory + '/' + year + '_event_1.jpg';
    }
    // check if the image exist in the file system.
    http.get(url, res => {
      res.once('data', chunk => {
        res.destroy();
        if (imageType(chunk) != null) {
          // Do nothing
        } else {
          console.log(imageCategory, ' image does not exits for the year ' + year);
          fs.appendFile('public/missingImages/' + fileName, imageCategory + ' image does not exits for the year ' + year + '\n', (err) => {
            if (err) throw err;
            // console.log('The file has been saved!');
          });
        }
      });
    });
  });

};
