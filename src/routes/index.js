const express = require('express');
const router = express.Router();

router.get('/login', function (req, res) {
    res.render('login', {error:false, logout:false});
});

router.get('/register', function (req, res) {
    res.render('register');
});

router.get('/', function (req, res) {
    res.render('sqlite');
});

module.exports = router;