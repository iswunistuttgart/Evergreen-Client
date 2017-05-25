var env = process.env.NODE_ENV || 'development';
var cfg = require('../config/configure')[env];
var fs = require('fs');
var soap = require('soap');
var webServiceUrl = cfg.WEBSERVICE_URL;
var xml2js = require('xml2js');
parseString = require('xml2js').parseString;

module.exports = {
  login: {
    fn: function(req, res, next) {
      req.assert('serveradress', 'bad_serveradress').notEmpty();
      req.assert('port', 'bad_port').notEmpty();
      req.assert('username', 'bad_username').notEmpty();
      req.assert('password', 'bad_password').notEmpty();

      var errors = req.validationErrors();
      if (errors) {
        errors.status = 403;
        return next(errors);
      }

      fs.readFile(webServiceUrl, 'utf-8', function(err, data) {

        if (err)
          return next(err);

        parseString(data, function(err, result) {
          if (err)
            return next(err);

          result['wsdl:definitions']['wsdl:service'][0]['wsdl:port'][0]['soap:address'][0]['$'].location = req.body.serveradress + ':' + req.body.port + '/malso/services/EvergreenWebService/';

          var builder = new xml2js.Builder();
          var xml = builder.buildObject(result);

          fs.writeFile(webServiceUrl, xml, function(err, data) {
            if (err)
              return next(err);

            var args = {
              loginInformation: {
                UserName: req.body.username,
                UserPassword: req.body.password
              }
            }

            if (cfg.IS_WEBSERVICE) {
              soap.createClient(webServiceUrl, {disableCache: true},  function(err, client) {
                if (err)
                  return next(err);

                client.Connection(args, function(err, response) {
                  if (err)
                    return next(err);

                  if (response.errors && response.errors.Errors) {
                    if (response.errors.Errors.ErrorId == '99') {
                      return next(new Error('username or password wrong!'))
                    }
                    return next(new Error('something wrong'))
                  }

                  if (!response.result)
                    return next(new Error('something wrong'))

                  res.send(response.result);
                })
              })
            } else {
              fs.readFile(cfg.LOGIN_RESULT, function(err, loginresult) {
                if (err)
                  return next(err);

                res.send(JSON.parse(loginresult).result);
              })
            }
          })
        });
      });
    }
  },
  logout: {
    fn: function(req, res, next) {

      req.assert('session', 'bad_session').notEmpty();

      var errors = req.validationErrors();
      if (errors) {
        errors.status = 403;
        return next(errors);
      }

      var args = {
        auth: {
          AuthSession: req.body.session
        }
      }

      if (cfg.IS_WEBSERVICE) {
        soap.createClient(webServiceUrl, function(err, client) {
          if (err)
            return next(err);

          client.Disconnect(args, function(err, response) {
            if (err)
              return next(err);

            if (response.errors && response.errors.Errors)
              return next(new Error('something wrong!'))

            res.send(response.result);
          })
        })
      } else {
        res.send('success');
      }
    }
  }
};
