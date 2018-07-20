const port = 8000;
var allowedOrigins = ['http://localhost:3000'];


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dbConfig = require('./config/db');
const session = require('express-session')
var mysql = require('mysql');
var connection = mysql.createConnection(dbConfig);
connection.connect(function(err) {
  if (err) {
    throw err;
  }
  console.log('You are now connected...')

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT, DELETE, POST, GET, OPTIONS");
    next();
  });
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/images', express.static('app/images'));

  app.set('trust proxy', 1) // trust first proxy
  app.use(session({
    secret: 'sp',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600 }
  }))
  
  require('./app/routes')(app, connection);
  
  app.listen(port, () => console.log('Example app listening on port' + port + '!'));
});