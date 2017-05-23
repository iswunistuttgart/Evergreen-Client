var env = process.env.NODE_ENV || 'development';
var cfg = require('../config/configure')[env];
var fs = require('fs');
var soap = require('soap');
var webServiceUrl = cfg.WEBSERVICE_URL;

module.exports = {
  get: {
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

          client.GetUserPageConfig(args, function(err, response) {
            if (err)
              return next(err);

            if (response.errors && response.errors.Errors)
              return next(new Error('something wrong'))

            if (!response.Config)
              return next(new Error('something wrong'))

            res.send(response.Config);
          })
        })
      } else {
        fs.readFile(cfg.GET_USER_PAGE_RESULT, function(err, result) {
          if (err)
            return next(err);

          var jsonData = JSON.parse(result);

          res.send(jsonData.Config);
        })
      }
    }
  },
  update: {
    fn: function (req, res, next) {
      req.assert('session', 'bad_session').notEmpty();

      var errors = req.validationErrors();
      if (errors) {
        errors.status = 403;
        return next(errors);
      }

      let args = {
        auth: {
          AuthSession: req.body.session
        },
        NewConfig: req.body.config
      }

      soap.createClient(webServiceUrl, function (err, client) {
        if (err)
          return next(err);

        client.ModifyUserPageConfig(args, function(err, response) {
          if (err)
            return next(err);

          if (response.errors && response.errors.Errors)
            return next(new Error('something wrong'))

          res.send(response);
        })
      })
    }
  }
};
