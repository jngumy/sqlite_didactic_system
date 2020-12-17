const express = require('express');
const app = express();
const path = require("path");

//settings
app.set('port', 5000);
app.set('view engine', 'ejs');
app.set('views', './views');
app.set('views', path.join(__dirname,'views'));
app.use(express.static(__dirname + '/static'));

//routes
app.use(require('./routes/index'));

app.listen('5000', function() {
    console.log('Servidor web escuchando en el puerto 5000');
});

