var Client = require('node-rest-client').Client;
var client = new Client();
var MongoClient = require('mongodb').MongoClient; // https://www.npmjs.com/package/mongodb
var assert = require('assert');
var url = 'mongodb://localhost:27017/birthday_app';
var async = require('async');

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");


  getAllMonths(function(months) {

    console.log(months); // print the key

    async.forEach(months, function(month, callback) {
      // console.log(month); 
      getAllDates(function(dates) {
        console.log(dates);
        async.forEach(dates, function(date, callback) {

          fetchEvents(month, date, function(events) {
            console.log(month);
            console.log(date);

            // console.log(events);
            var arr = [];

            async.forEach(events, function(event, callback) {
              var obj = {};
              obj.year = event.year;
              obj.event = event.text;
              arr.push(obj);

              // tell async that that particular element of the iterator is done
              callback(); //iterating a single event done

            }, function(err) {
              console.log('month', month);
              console.log('date', date);
              console.log(arr);
              console.log('iterating all events done');

              var collection = db.collection("events");
              collection.insert({ 'month': month, 'date': date, 'events': arr });
              console.log('Data insertion in db is done')
            });
          });

          // tell async that that particular element of the iterator is done
          callback(); // iteration of specific date done
        }, function(err) {
          console.log('iterating all dates done');
        });
      });

      // tell async that that particular element of the iterator is done
      callback(); // Iterating of specific month done

    }, function(err) {
      console.log('iterating all months done');
    });
  });



  function getAllMonths(callback) {
    var months = [1];
    callback(months);
  }

  function getAllDates(callback) {
    var dates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    callback(dates);
  }

  function fetchEvents(month, date, callback) {
    console.log('hello');
    console.log(month, date);
    var args = {
      path: { "month": month, "date": date }
    };

    var muff = client.get('http://history.muffinlabs.com/date/${month}/${date}', args, function(res, response) {
      if (Buffer.isBuffer(res)) {
        res = res.toString('utf8'); // buffers to string
      }

      var obj = JSON.parse(res); // string to Object type JSON again
      var events = obj.data.Events;
      callback(events);

    });

  }
});
