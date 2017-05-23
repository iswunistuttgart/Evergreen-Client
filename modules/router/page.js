var env = process.env.NODE_ENV || 'development';
var cfg = require('../config/configure')[env];
var fs = require('fs');
var soap = require('soap');
var webServiceUrl = cfg.WEBSERVICE_URL;

module.exports = {
  add: {
    fn: function(req, res, next) {
      req.assert('session', 'bad_session').notEmpty();
      req.assert('page', 'bad_page').notEmpty();

      var errors = req.validationErrors();
      if (errors) {
        errors.status = 403;
        return next(errors);
      }

      let args = {
        auth: {
          AuthSession: req.body.session
        },
        NewPage: req.body.page
      }

      if (cfg.IS_WEBSERVICE) {

        soap.createClient(webServiceUrl, function(err, client) {
          if (err)
            return next(err);

          client.AddPage(args, function(err, response) {
            if (err)
              return next(err);

            if (response.errors && response.errors.Errors)
              return next(new Error('something wrong'))

            res.send(response);
          })
        })
      } else {
        res.send({"PageId": "348", "errors": null})
      }
    }
  },
  delete: {
    fn: function(req, res, next) {
      req.assert('session', 'bad_session').notEmpty();
      req.assert('pageId', 'bad_page_id').notEmpty();

      var errors = req.validationErrors();
      if (errors) {
        errors.status = 403;
        return next(errors);
      }

      let args = {
        auth: {
          AuthSession: req.body.session
        },
        PageID: req.body.pageId
      }

      if (cfg.IS_WEBSERVICE) {

        soap.createClient(webServiceUrl, function (err, client) {
          if (err)
            return next(err);

          client.DeletePage(args, function(err, response) {
            if (err)
              return next(err);

            if (response.errors && response.errors.Errors)
              return next('something wrong')

            res.send(response);
          })
        })
      } else {
        res.send('success')
      }
    }
  },
  update: {
    fn: function(req, res, next) {
      req.assert('session', 'bad_session').notEmpty();
      req.assert('page', 'bad_page').notEmpty();

      var errors = req.validationErrors();
      if (errors) {
        errors.status = 403;
        return next(errors);
      }

      let args = {
        auth: {
          AuthSession: req.body.session
        },
        Page: req.body.page
      }

      if (cfg.IS_WEBSERVICE) {

        soap.createClient(webServiceUrl, function (err, client) {
          if (err)
            return next(err);

          client.ModifyPage(args, function(err, response) {
            if (err)
              return next(err);

            if (response.errors && response.errors.Errors)
              return next('something wrong')

            res.send(response);
          })
        })
      } else {
        res.send('success')
      }
    }
  },
};
