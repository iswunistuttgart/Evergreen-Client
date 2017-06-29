var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var socket_io = require("socket.io");

var conductor = require('../conductor');
var router = require('../router');
var socket = require('../socket');

var headers = require('../headers');
var errorHandler = require('../errorhandler');

var env = process.env.NODE_ENV || 'development';
var cfg = require('./configure')[env];

var app = express();

var io = socket_io();
app.io = io;

// socket.io events
socket(io);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
app.use(express.static(path.join(__dirname, '..', '..', 'public')));
app.use(express.static(path.join(__dirname, '..', '..')));

if (env === 'development') {
  app.use(headers);
  // app.use('/docs', express.static(path.join(__dirname, 'docs'))); // TODO: add api documentation
}

app.use('/true', function (req, res) {
  res.redirect('/');
})

app.use('/rest', conductor);
router(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(errorHandler);

module.exports = app;
