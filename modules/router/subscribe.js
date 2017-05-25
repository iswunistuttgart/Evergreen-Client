var env = process.env.NODE_ENV || 'development';
var cfg = require('../config/configure')[env];
var fs = require('fs');
var soap = require('soap');
var webServiceUrl = cfg.WEBSERVICE_URL;

module.exports = {
  create: {
    fn: function(req, res, next) {
      req.assert('session', 'bad_session').notEmpty();
      req.assert('varId', 'bad_varId').notEmpty();
      req.assert('machineId', 'bad_machineId').notEmpty();
      req.assert('contextId', 'bad_contextId').notEmpty();

      var errors = req.validationErrors();
      if (errors) {
        errors.status = 403;
        return next(errors);
      }

      let args = {
        auth: {
          AuthSession: req.body.session
        },
        subscriptions: {
          UserSubscription: {
            ContextId: req.body.contextId,
            Variable: {
              VarId: req.body.varId,
              MaschineId: req.body.machineId,
              Prefrences: {
                TolleranceIntervall: req.body.tolleranceInterval || 5,
                TolleranceRange: 0
              }
            }
          }
        }
      }

      let unsubscribeArgs = {
        auth: {
          AuthSession: req.body.session
        },
        unsubscribeItems: {
          VarSubscriptions: req.body.contextId
        }
      }

      if (cfg.IS_WEBSERVICE) {

        soap.createClient(webServiceUrl, function(err, client) {
          if (err)
            return next(err);

          client.Unsubscribe(unsubscribeArgs, function (err) {
            client.Subscribe(args, function(err, response) {
              if (err)
                return next(err);

              if (response.errors && response.errors.Errors)
                return next(new Error('something wrong'))

              res.send(response);
            })
          })
        })
      } else {
        res.send('success');
      }
    }
  },
  read: {
    fn: function(req, res, next) {
      req.assert('session', 'bad_session').notEmpty();
      req.assert('varId', 'bad_varId').notEmpty();
      req.assert('machineId', 'bad_machineId').notEmpty();

      var errors = req.validationErrors();
      if (errors) {
        errors.status = 403;
        return next(errors);
      }

      let args = {
        auth: {
          AuthSession: req.body.session
        },
        readVarIdSet: {
          VarId: {
            MachineId: req.body.machineId,
            ElementId: req.body.varId
          }
        }
      }

      let unsubscribeArgs = {
        auth: {
          AuthSession: req.body.session
        },
        unsubscribeItems: {
          VarSubscriptions: req.body.contextId
        }
      }

      if (cfg.IS_WEBSERVICE) {

        soap.createClient(webServiceUrl, function(err, client) {
          if (err)
            return next(err);

          client.Unsubscribe(unsubscribeArgs, function (err) {
            client.ReadVariableSet(args, function(err, response) {
              if (err)
                return next(err);

              if (response.errors && response.errors.Errors)
                return next(new Error('something wrong'))

              res.send(response);
            })
          })
        })
      } else {
        res.send({
          "readVarSetResult": {
            "VarValues": {
              "VarId": "DemoDouble",
              "MachineId": "TEST_MACHINE",
              "VarValue": "62875.9999999"
            }
          },
          "errors": null
        });
      }
    }
  },
  write: {
    fn: function(req, res, next) {
      req.assert('session', 'bad_session').notEmpty();
      req.assert('varId', 'bad_varId').notEmpty();
      req.assert('machineId', 'bad_machineId').notEmpty();
      req.assert('varValue', 'bad_varValue').notEmpty();

      var errors = req.validationErrors();
      if (errors) {
        errors.status = 403;
        return next(errors);
      }

      let args = {
        auth: {
          AuthSession: req.body.session
        },
        writeVarSet: {
          VarValues: {
            MachineId: req.body.machineId,
            VarId: req.body.varId,
            VarValue: req.body.varValue
          }
        }
      }

      let readArgs = {
        auth: {
          AuthSession: req.body.session
        },
        readVarIdSet: {
          VarId: {
            MachineId: req.body.machineId,
            ElementId: req.body.varId
          }
        }
      }

      if (cfg.IS_WEBSERVICE) {

        soap.createClient(webServiceUrl, function(err, client) {
          if (err)
            return next(err);

          client.WriteVariableSet(args, function(err, response) {
            if (err)
              return next(err);

            if (response.errors && response.errors.Errors)
              return next(new Error('something wrong'))

            client.ReadVariableSet(readArgs, function (err, response) {
              if (err)
                return next(err);

              if (response.errors && response.errors.Errors)
                return next(new Error('something wrong'))

              res.send(response);
            })
          })
        })
      } else {
        res.send(true);
      }
    }
  },
  remove: {
    fn: function (req, res, next) {
      req.assert('session', 'bad_session').notEmpty();
      req.assert('contextId', 'bad_contextId').notEmpty();

      var errors = req.validationErrors();
      if (errors) {
        errors.status = 403;
        return next(errors);
      }

      let args = {
        auth: {
          AuthSession: req.body.session
        },
        unsubscribeItems: {
          VarSubscriptions: req.body.contextId
        }
      }

      if (cfg.IS_WEBSERVICE) {

        soap.createClient(webServiceUrl, function(err, client) {
          if (err)
            return next(err);

          client.Unsubscribe(args, function (err, response) {
            if (err)
              return next(err);

            if (response.errors && response.errors.Errors)
              return next(new Error('something wrong'))

            res.send(response);
          })
        })
      } else {
        res.send('success');
      }
    }
  }
};
