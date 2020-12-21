
module.exports = function(app, passport, Historial){
    //var mensaje = '' ; 
    app.get('/login', function (req, res) {
        res.render('login', {mensaje: req.flash('message')});
    });
    
    app.post('/login', passport.authenticate('local-signin', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

    app.get('/register', function (req, res) {
        res.render('register',  {mensaje: req.flash('message')});
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

    app.get('/historial',isLoggedIn, function (req, res) {
        Historial.findAll({
            where: {
              userId: req.user.id
            },
            order: [
                ['fecha', 'DESC'],
            ],
        }).then((historiales) => {
            if(historiales.length != 0){
                aux_historiales = []
                historiales.forEach(element => {
                    aux_historiales.push(element.dataValues)
                });
                res.render('historial', {username: req.user.username, hist : aux_historiales, flag: true});
            }
            else
                res.render('historial', {username: req.user.username, hist : 'Sin resultados', flag: false });
        }).catch(e => console.log(e))
    }); 

    app.post('/save-consulta', isLoggedIn, function(req, res){
        //recibir la consulta y tabla resultado y guardar en la bd
        var data =
        {
            consulta: req.body.query,
            resultado: req.body.results,
            fecha: new Date().toISOString(),
            userId: req.user.id
        };
        
        
        
        Historial.create(data).then(function (newHistorial, created) {
            if (!newHistorial) {
                console.log('No se pudo crear el nuevo historial');
            }
            else{
                console.log('Se creó el nuevo registro historial');
            }
        });
        
    })

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/login');
     
    }
}


