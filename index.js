const express = require('express');
const session = require('express-session');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const app = express();
const http = require('http');
const config = require('./config');
//passport configuration:
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});
passport.use('provider', new OAuth2Strategy({
        authorizationURL: config.sso + 'authorize/',
        tokenURL: config.sso + 'token/',
        clientID: config.client_id,
        clientSecret: config.client_secret,
        callbackURL: config.home + 'callback'
    },
    function (accessToken, refreshToken, profile, done) {
        console.log(accessToken, refreshToken, profile);
        var options = {
            host: 'sandbox.fanapium.com',
            path: '/user',
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        };

        console.log("Start");
        http.get(options, function (res) {
            console.log("Connected");
            res.on('data', function (data) {
                let user = JSON.parse(data.toString());
                console.log(user);
                let err = null;
                done(err, user)

            });
        });
    }
));

//app configs:
app.set('view engine', 'ejs');
let url = function (target) {
    return (config.home + target);
};
app.locals.url = url;
//general middlewares:
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
//routes:
app.get('/', function (req, res) {
    if (req.user) {
        res.render('home', {loggedIn: true, 'user': req.user});
    }
    else {
        res.render('home', {loggedIn: false});
    }
});


app.get('/login', passport.authenticate('provider'));
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect(url(''));
});
app.get('/register', function (req, res) {
    res.redirect(config.sso+'authorize/?client_id='+config.client_id+'&response_type=code&redirect_uri='+config.home + 'callback&prompt=signup');
});

app.get('/callback',
    passport.authenticate('provider', {
        successRedirect: url('protected'),
        failureRedirect: url('login')
    }));

app.get('/protected', function (req, res) {
    if (req.user) {
        res.render('protected', {loggedIn: true, 'user': req.user});
    }
    else {
        res.render('protected', {loggedIn: false});
    }
});
app.get('/user_info', function (req, res) {
    if (req.user) {
        res.render('userInfo', {loggedIn: true, 'user': req.user});
    }
    else {
        res.render('userInfo', {loggedIn: false});
    }
});
app.listen({port: '8080', hostname: '0.0.0.0'}, function () {
    console.log('express is listening on 8080');
});
