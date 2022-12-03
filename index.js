require('dotenv').config();
const express = require('express'),
    passport = require('passport'),
    MicrosoftStrategy = require('passport-microsoft').Strategy,
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    rateLimit = require('express-rate-limit'),
    cors = require('cors');

const MICROSOFT_GRAPH_CLIENT_ID = process.env.MICROSOFT_GRAPH_CLIENT_ID;
const MICROSOFT_GRAPH_CLIENT_SECRET = process.env.MICROSOFT_GRAPH_CLIENT_SECRET;

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 15,
});

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(
    new MicrosoftStrategy({
            clientID: MICROSOFT_GRAPH_CLIENT_ID,
            clientSecret: MICROSOFT_GRAPH_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/microsoft/callback',
            scope: ['user.read'],
            authorizationURL: 'https://login.microsoftonline.com/9cb1f9b2-0d99-4462-b36d-ddff5e60eb35/oauth2/v2.0/authorize',
            tokenURL: 'https://login.microsoftonline.com/9cb1f9b2-0d99-4462-b36d-ddff5e60eb35/oauth2/v2.0/token',
        },
        function(accessToken, refreshToken, profile, done) {
            // asynchronous verification, for effect...
            process.nextTick(function() {
                // To keep the example simple, the user's Microsoft Graph profile is returned to
                // represent the logged-in user. In a typical application, you would want
                // to associate the Microsoft account with a user record in your database,
                // and return that user instead.
                return done(null, profile);
            });
        }
    )
);

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
    })
);
app.use(
    cors({
        origin: '*',
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', limiter, function(req, res) {
    res.render('index', { user: req.user });
});

app.post('/', limiter, (req, res) => {
    res.send('Hello World!');
    console.log(req.body);
});

app.get('/account', limiter, ensureAuthenticated, function(req, res) {
    res.render('account', { user: req.user });
});

app.get('/login', limiter, passport.authenticate('microsoft', {}));

app.get(
    '/auth/microsoft/callback',
    limiter,
    passport.authenticate('microsoft', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    }
);

app.get('/logout', limiter, function(req, res, next) {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

app.use(express.static(__dirname + '/public'));

app.listen(3000);

console.log('App running on http://localhost:3000');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}