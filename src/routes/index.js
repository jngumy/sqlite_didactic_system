
module.exports = function(app, passport){

    app.get('/login', function (req, res) {
        res.render('login', { error:false, logout:false});
    });
    
    app.post('/login', passport.authenticate('local-signin', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

    app.get('/register', function (req, res) {
        res.render('register');
    });
    
    app.post('/register', passport.authenticate('local-signup', {
        successRedirect: '/login',
        failureRedirect: '/register'
    }));
    
    app.get('/',isLoggedIn, function (req, res) {
        res.render('sqlite', {username: req.user.username});
    });    

    app.get('/logout', function (req, res) {
        req.session.destroy(function(err) {
            res.redirect('/');
        });
    });    

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/login');
     
    }
}


