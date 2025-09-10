var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars')
var db = require('./connection/connect')
var fileUpload = require('express-fileupload')
var session = require('express-session')
var db = require('./connection/connect')
const consts = require('./connection/constants')



var userRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var workerRouter = require('./routes/workers');
var constructiveedge = require('./routes/starting');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/', partialsDir: __dirname + '/views/partials/' }))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())
app.use(session({ secret: "key", cookie: { maxAge: 600000 } }))
app.use((req, res, next) => {
  adminRegisterCheck()
  next()
})


app.use('/', userRouter);
app.use('/admin', adminRouter);
app.use('/workers', workerRouter);
app.use('/worklink', constructiveedge);

db.connection().then((data) => {
  console.log(data);
}).catch((err) => {
  console.log(err);
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

async function adminRegisterCheck() {
  try {
    const admin = await db.get().collection(consts.admin_base).find().toArray();

    if (admin.length != 0) {
      console.log("Admin Already Registered");
      return;
    }
    const admin_credentials = {
      name: "admin",
      password: "admin",
      displayname: "W-Link admin 1"
    }

    await db.get().collection(consts.admin_base).insertOne(admin_credentials);
    console.log("Admin Auto Registration Success");

    return;
  } catch (error) {
    console.log(error);
    return;

  }
}

module.exports = app;
