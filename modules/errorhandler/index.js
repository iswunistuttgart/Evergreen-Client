var error_handler;
var env = process.env.NODE_ENV || 'development';

if (env === 'production') {
  error_handler = function(err, req, res, next) { // TODO: we can hide error log when production logic
    res.status(err.status || 500).json({
      message: err.message,
      error: err
    });
  }
} else {
  error_handler = function(err, req, res, next) {
    res.status(err.status || 500).json({
      message: err.message,
      error: err
    });
  }
}

module.exports = error_handler;
