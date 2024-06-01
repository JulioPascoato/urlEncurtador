const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerjsdoc = require('swagger-jsdoc');
const swaggerui = require('swagger-ui-express');


const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Encurtador de URL - Documentação da API",
      version: "0.1.0",
      description:
        "Documentação do projeto encurtador de URL",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Julio Cesar Mazziero Pascoato",
        url: process.env.DOMAIN,
        email: "jpascoato@gmail.com",
      },
    },
    servers: [
      {
        url: process.env.DOMAIN,
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const app = express();

const spacs = swaggerjsdoc(options);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);

app.use('/api-docs', swaggerui.serve, swaggerui.setup(spacs))

app.use('/', indexRouter);


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





module.exports = app;
