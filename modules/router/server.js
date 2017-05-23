var fs = require('fs');
var xml2js = require('xml2js');
var parseString = xml2js.parseString;
var env = process.env.NODE_ENV || 'development';
var cfg = require('../config/configure')[env];

module.exports = {
  read: {
    fn: function(req, res, next) {

      fs.readFile(cfg.SERVERLIST_XML, 'utf-8', function(err, data) {
        if (err)
          return next(err);

        parseString(data, function(err, result) {
          if (err)
            return next(err);

          var serverList = result.serverlist.server;

          var serverNames = serverList.map(function(server) {
            return {serverName: server.serverName[0], serverAdress: server.serverAdress[0], port: server.port[0]};
          });

          var object = {
            "serverlist": serverNames,
            "errormessage": "ERROR"
          };

          jsondata = JSON.stringify(object);
          res.send(jsondata);
        });
      });
    }
  },
  add: {
    fn: function(req, res, next) {
      req.assert('servername', 'bad_servername').notEmpty();
      req.assert('serverip', 'bad_serverip').notEmpty();
      req.assert('serverport', 'bad_serverport').notEmpty();

      var errors = req.validationErrors();
      if (errors) {
        errors.status = 403;
        return next(errors);
      }

      req.body.serverip = (req.body.serverip.indexOf('http://') === -1 && req.body.serverip.indexOf('https://') === -1 ) ? 'http://' + req.body.serverip : req.body.serverip;

      fs.readFile(cfg.SERVERLIST_XML, 'utf-8', function(err, data) {
        if (err) {
          return next(err);
        }

        parseString(data, function(err, result) {
          if (err) {
            return next(err);
          }

          var serverList = result.serverlist.server;
          //get the serverNames from json and save as array
          var serverNames = serverList.map((server) => {
            return server.serverName[0];
          });
          //CHECK IF SERVERNAME EXISTS and Add server
          function checkAndAdd(servername, serverip, serverport) {
            //var id = serverList.length + 1;
            var found = serverList.some(function(serveritem) {
              return serveritem.serverName[0] === servername;
            });
            if (!found) {
              return serverList.push({"serverName": [servername], "serverAdress": [serverip], "port": [serverport]});
            } else {
              return false;
            }
          }
          var checker = checkAndAdd(req.body.servername, req.body.serverip, req.body.serverport);

          if (!checker)
            return next(new Error('Server already exists please type other name'));

          // create a new builder object and then convert
          // our json back to xml.
          var builder = new xml2js.Builder();
          var xml = builder.buildObject(result);
          fs.writeFile(cfg.SERVERLIST_XML, xml, function(err, data) {
            if (err) {
              return next(err)
            }

            res.send('success!')
          })
        });
      });
    }
  },
  remove: {
    fn: function(req, res, next) {
      req.assert('servername', 'bad_servername').notEmpty();

      var errors = req.validationErrors();
      if (errors) {
        errors.status = 403;
        return next(errors);
      }

      fs.readFile(cfg.SERVERLIST_XML, 'utf-8', function(err, data) {
        if (err)
          return next(err);

        // we then pass the data to our method here
        parseString(data, function(err, result) {
          if (err)
            return next(err);

          // here we log the results of our xml string conversion
          var serverList = result.serverlist.server;

          // get the serverNames from json and save as array
          var serverNames = serverList.map((server) => {
            return server.serverName[0];
          });

          // delete server from array
          result.serverlist.server = serverList.filter(server => server.serverName[0] != req.body.servername);

          // create a new builder object and then convert
          // our json back to xml.
          var builder = new xml2js.Builder();
          var xml = builder.buildObject(result);

          fs.writeFile(cfg.SERVERLIST_XML, xml, function(err, data) {
            if (err)
              return next(err);

            res.send('success!');
          })
        });
      });
    }
  }
};
