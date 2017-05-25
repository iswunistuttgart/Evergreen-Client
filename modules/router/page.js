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
  get: {
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

            var tempData = {};

            if (Object.prototype.toString.call( response.Config.Groups ) === '[object Object]') {
              if (Object.prototype.toString.call( response.Config.Groups.Pages ) === '[object Object]') {
                if (parseInt(response.Config.Groups.Pages.Id) == parseInt(req.body.page)) {
                  tempData = response.Config.Groups.Pages.Id;
                }
              } else if (response.Config.Groups.Pages) {
                response.Config.Groups.Pages.forEach(function (page) {
                  if (parseInt(page.Id) == parseInt(req.body.page)) {
                    tempData = page;
                  }
                })
              }
            } else if (response.Config.Groups) {
              response.Config.Groups.forEach(function (group) {
                if (Object.prototype.toString.call( group.Pages ) === '[object Object]') {
                  if (parseInt(group.Pages.Id) == parseInt(req.body.page)) {
                    tempData = group.Pages.Id;
                  }
                } else if (group.Pages) {
                  group.Pages.forEach(function (page) {
                    if (parseInt(page.Id) == parseInt(req.body.page)) {
                      tempData = page;
                    }
                  })
                }
              })
            }

            if (tempData.ConfigXML) {
              tempData.ConfigXML = Buffer.from((tempData.ConfigXML), 'base64').toString("ascii")

              try {
                tempData.ConfigXML = JSON.parse(tempData.ConfigXML);
              } catch (e) {
                tempData.ConfigXML = [];
              }
            }

            res.send(tempData);
          })
        })
      } else {
        res.send('success')
      }
    }
  },
};
