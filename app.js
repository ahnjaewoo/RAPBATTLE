var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var passport = require('./config/passport');
var router = express.Router();

var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var rap = require('./routes/rap');
var config = require('./config/config');

var app = express();

//connect database
mongoose.connect('mongodb://'+config.account.mongoid+':'+config.account.mongopw+'@ds147902.mlab.com:47902/ahnpersie_db', { useMongoClient: true });

var db = mongoose.connection;
db.once("open",function(){
  console.log("DB connected!");
});
db.on("error",function (err){
  console.log("DB ERROR :", err);
});

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


app.use(flash());
app.use(router);

app.use(session({secret:"SFQWSWL"}));
app.use(passport.initialize());
app.use(passport.session());





app.all('/', index);
app.all('/users*', users);
app.all('/login*', login);
app.all('/rap*', rap);
app.all('/logout',function(request,response){
    request.logout();
    response.json({success:true});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
