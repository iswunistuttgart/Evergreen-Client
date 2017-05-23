var handles = {};

handles['page'] = require('./page');
handles['server'] = require('./server');
handles['auth'] = require('./auth');
handles['pageconfig'] = require('./pageconfig');
handles['node'] = require('./node');
handles['subscribe'] = require('./subscribe');

var io = {};

io['machine'] = require('./machine');

module.exports = function(app) {
  for (var moduleKey in handles) {
    var module = handles[moduleKey];

    for (var actionKey in module) {
      var action = module[actionKey];
      var path = '/rest/' + moduleKey + '/' + actionKey;

      app.use(path, action.fn)
    }
  }

  for (var moduleKey in io) {
    var module = io[moduleKey];

    for (var actionKey in module) {
      var action = module[actionKey];
      var path = '/rest/' + moduleKey + '/' + actionKey;

      app.use(path, action.fn(app.io))
    }
  }
}

module.exports.handles = handles;
module.exports.io = io;
