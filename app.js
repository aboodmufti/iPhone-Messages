var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var multer = require('multer');
var fs_x = require('fs-extra');
var fs = require('fs');
/*
var last_file = null;
//console.log(process.env);
fs_x.removeSync('./tmp')
fs.readdir("/Users/"+process.env.SUDO_USER+"/Library/Application Support/MobileSync/Backup", function(err, files){
    if(err){
        console.log(err)
    }else{
        last_file = files[0];
        
        var last = new Date(fs.statSync("/Users/"+process.env.SUDO_USER+"/Library/Application Support/MobileSync/Backup/"+files[0]).ctime);
        var max_time = last.getTime();
        
        for(i=1 ; i< files.length;++i){
            var new_last = new Date(fs.statSync("/Users/"+process.env.SUDO_USER+"/Library/Application Support/MobileSync/Backup/"+files[i]).ctime);
            if(max_time < new_last.getTime()){
                max_time = new_last.getTime();
                last_file = files[i];
            }
        }
        
        fs_x.copy("/Users/"+process.env.SUDO_USER+"/Library/Application Support/MobileSync/Backup/"+last_file+"/3d0d7e5fb2ce288813306e4d4636395e047a3d28", './tmp/messages.db', function (err) {
          if (err) {console.log("error copying file - TELL ABOOD")}
          console.log("COPY SUCCESS!");
        });
        /*
        fs_x.copy("/Users/"+process.env.USER+"/Desktop/Abood.zip", './tmp/messages.db', function (err) {
          if (err) {console.log("error copying file - TELL ABOOD")}
          console.log("COPY SUCCESS!");
          
        });
        //
    }

});

*/


var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(multer({
    dest: './public/uploads',
    inMemory: false ,
}));

app.use(session({
    secret: "Abood is great!",
    store: new FileStore({
        ttl: 432000,
        }),
    resave: false,
    saveUninitialized: true
  }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

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
    app.locals.pretty = true;
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
