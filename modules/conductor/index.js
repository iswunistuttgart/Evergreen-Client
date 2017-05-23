var handles = require('../router').handles;
var io = require('../router').io;

module.exports = function(req, res, next) {
  var paths = req.path.split('/');

  if (paths.length < 3) {
    var err = new Error('bad_request');
    err.status = 403;
    return next(err);
  }

  var moduleKey = paths[1];
  var actionKey = paths[2];

  var module = handles[moduleKey];
  var module1 = io[moduleKey];

  if (!module && !module1) {
    var err = new Error('bad_request');
    err.status = 403;
    return next(err);
  }

  if (module) {
    var action = module[actionKey];

    if (!action) {
      var err = new Error('bad_request');
      err.status = 403;
      return next(err);
    }
  }

  if (module1) {
    var action = module1[actionKey];

    if (!action) {
      var err = new Error('bad_request');
      err.status = 403;
      return next(err);
    }
  }

  var task = moduleKey + '/' + actionKey

  next();
}
