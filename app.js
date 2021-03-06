// #Modules
const express = require('express'),
      path = require('path'),
      favicon = require('serve-favicon'),
      logger = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      config = require("./config"),
      flags = require("./api/common/flags"),
      switchState = require("./api/common/switchState");
// #Routes
const routes = require('./routes/index'),
      switches = require('./api/switches'),
      jsonfile = require('jsonfile');

// #App
const app = express(),
      switchesFile = './switches.json';

jsonfile.readFile(switchesFile, (err, obj) =>{
    if(err === null) {
        console.log('File exists');
        switchState.activateSwitches(obj.switches);
        flags.areSwitchesRegistered = true;

    } else if(err.code === 'ENOENT') {
        // file does not exist
        flags.areSwitchesRegistered = false;
        console.log(flags, "file does not exits")
    } else {
        console.log('Some other error: ', err.code);
    }
});

app.set('xecret', config.secret);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api/v1/switches', switches);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
