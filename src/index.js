const express = require('express');
var passport = require('passport')
var session = require('express-session')
var bodyParser = require('body-parser')
var sqlite3 = require('sqlite3');
const { Sequelize } = require('sequelize');


var db = new sqlite3.Database('./database.sqlite3');

// sequelize config Passing parameters separately (sqlite)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite3'
});


const User = sequelize.define('user', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },

    firstname: {
        type: Sequelize.STRING,
        notEmpty: true
    },

    lastname: {
        type: Sequelize.STRING,
        notEmpty: true
    },
    username: {
        type: Sequelize.TEXT
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },

    last_login: {
        type: Sequelize.DATE
    },

    status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active'
    }
  }, {
    // Other model options go here
  });

async function syncDB(){
    try {
        await sequelize.sync();
        console.log("All models were synchronized successfully.");
    }
    catch(e){
        console.log(e, 'Something went wrong')
    }
}

syncDB();

const app = express();
const path = require("path");



// For Passport
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//settings
app.set('port', 5000);
app.set('view engine', 'ejs');
app.set('views', './views');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/static'));
//routes
var authRoute = require('./routes/index.js')(app,passport);





//load passport strategies
require('./config/passport/passport.js')(passport, User);

app.listen('5000', function () {
    console.log('Servidor web escuchando en el puerto 5000');
});

