var env = process.env.NODE_ENV || 'development';
var cfg = require('../config/configure')[env];
var soap = require('soap');
var webServiceUrl = cfg.WEBSERVICE_URL;

var sockets = {};
var users = {};

var testData = {
  "notifications": {
    "UserNotifications": [
      {
        "ContextId": "1",
        "Variable": {
          "VarId": "DemoBool",
          "MachineId": "1",
          "VarValue": "true"
        }
      }, {
        "ContextId": "0",
        "Variable": {
          "VarId": "DemoDouble",
          "MachineId": "0",
          "VarValue": "203463.700001"
        }
      }
    ]
  },
  "errors": null
}

module.exports = function(io) {
  io.on("connection", function(socket) {
    console.log('connection');
    sockets[socket.id] = socket;
    var newInterval;
    var oldIntervalTollerance;

    socket.on('subscribe', function(data) {

      if (!users[socket.id]) {
        users[socket.id] = {
          session: data.session,
          contextIds: [data.contextId]
        }
      } else {
        users[socket.id].contextIds.push(data.contextId);
      }

      if (newInterval) {
        clearInterval(newInterval);
      }

      oldIntervalTollerance = (oldIntervalTollerance && (oldIntervalTollerance < (data.tolleranceInterval > 200 ? data.tolleranceInterval : 200))) ? oldIntervalTollerance : (data.tolleranceInterval > 200 ? data.tolleranceInterval : 200);

      newInterval = setInterval(function() {
        if (cfg.IS_WEBSERVICE) {
          var args = {
            auth: {
              AuthSession: data.session
            }
          }

          soap.createClient(webServiceUrl, function(err, client) {
            if (err)
              return console.log(err);

            client.PublicRequest(args, function(err, response) {
              if (err)
                return console.log(err);

              if (response.errors && response.errors.Errors)
                return console.log('something wrong!')

              if (!response.notifications)
                return;

              socket.emit('subscription_result', {tolleranceInterval: data.tolleranceInterval > 200 ? data.tolleranceInterval : 200, response: response})
            })
          })
        } else {
          testData.notifications.UserNotifications.forEach(function(entry) {
            entry.Variable.VarValue = Math.random();
          })
          socket.emit('subscription_result', {tolleranceInterval: data.tolleranceInterval > 200 ? data.tolleranceInterval : 200, response: testData})
        }
      }, oldIntervalTollerance);
    })
    socket.on('disconnect', function() {
      delete sockets[socket.id];
      clearInterval(newInterval);

      var tempSub;

      if (users[socket.id]) {
        if (users[socket.id].contextIds.length > 1) {
          tempSub = users[socket.id].contextIds;
        } else {
          tempSub = users[socket.id].contextIds[0]
        }

        var args = {
          auth: {
            AuthSession: users[socket.id].session
          },
          unsubscribeItems: {
            VarSubscriptions: tempSub
          }
        };
        soap.createClient(webServiceUrl, function(err, client) {
          client.Unsubscribe(args, function(err, result) {
            console.log(JSON.stringify(result));
          });
        });
      }
    });
  });
}
