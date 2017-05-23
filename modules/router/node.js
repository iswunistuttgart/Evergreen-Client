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

      let args = {
        auth: {
          AuthSession: req.body.session
        }
      }

      if (cfg.IS_WEBSERVICE) {

        soap.createClient(webServiceUrl, function (err, client) {
          if (err)
            return next(err);

          client.GetAllNodes(args, function(err, response) {
            if (err)
              return next(err);

            if (response.errors && response.errors.Errors)
              return next('something wrong!')

            res.send(response);
          })
        })
      } else {
        res.send(fs.readFileSync(cfg.GET_NODES_RESULT));
      }
    }
  }
};
