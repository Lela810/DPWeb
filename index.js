require('dotenv').config();
const express = require('express'),
	passport = require('passport'),
	MicrosoftStrategy = require('passport-microsoft').Strategy,
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	rateLimit = require('express-rate-limit'),
	cors = require('cors'),
	mongoose = require('mongoose'),
	{
		loadAllDPs,
		createDetailprogramm,
		loadDetailprogramm,
		editDetailprogramm,
	} = require('./js/db.js');

const MICROSOFT_GRAPH_CLIENT_ID = process.env.MICROSOFT_GRAPH_CLIENT_ID;
const MICROSOFT_GRAPH_CLIENT_SECRET = process.env.MICROSOFT_GRAPH_CLIENT_SECRET;

if (!process.env.MONGODB_USERNAME || !process.env.MONGODB_PASSWORD) {
	mongoose.connect(`mongodb://${process.env.MONGODB}/DPWEB`, {
		useNewUrlParser: true,
	});
} else {
	mongoose.connect(
		`mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB}/DPWEB`,
		{ useNewUrlParser: true }
	);
}

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 15,
});

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

passport.use(
	new MicrosoftStrategy(
		{
			clientID: MICROSOFT_GRAPH_CLIENT_ID,
			clientSecret: MICROSOFT_GRAPH_CLIENT_SECRET,
			callbackURL: 'http://localhost:3000/auth/microsoft/callback',
			scope: ['user.read'],
			authorizationURL:
				'https://login.microsoftonline.com/9cb1f9b2-0d99-4462-b36d-ddff5e60eb35/oauth2/v2.0/authorize',
			tokenURL:
				'https://login.microsoftonline.com/9cb1f9b2-0d99-4462-b36d-ddff5e60eb35/oauth2/v2.0/token',
		},
		function (accessToken, refreshToken, profile, done) {
			process.nextTick(function () {
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
app.use(bodyParser.raw());
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

app.get('/', limiter, function (req, res) {
	if (req.isAuthenticated()) {
		res.redirect('/home');
	}
	res.render('index', {
		user: req.user,
		page: 'Welcome',
	});
});

app.get('/home', limiter, ensureAuthenticated, function (req, res) {
	res.render('home', {
		user: req.user,
		page: 'Home',
	});
});

app.get(
	'/detailprogramme',
	limiter,
	ensureAuthenticated,
	async function (req, res) {
		res.render('detailprogramme', {
			user: req.user,
			page: 'Detailprogramme',
			detailprogramme: await loadAllDPs(),
		});
	}
);

app.get(
	'/detailprogramme/edit',
	limiter,
	ensureAuthenticated,
	async function (req, res) {
		res.render('editDetailprogramm', {
			user: req.user,
			page: 'Detailprogramme',
			detailprogramm: await loadDetailprogramm(req.query.detailprogrammId),
		});
	}
);
app.post('/detailprogramme/create', limiter, (req, res) => {
	try {
		createDetailprogramm(req.body);
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});
app.post('/detailprogramme/edit', limiter, (req, res) => {
	try {
		editDetailprogramm(req.query.detailprogrammId, req.body);
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});

app.get('/login', limiter, passport.authenticate('microsoft', {}));

app.get(
	'/auth/microsoft/callback',
	limiter,
	passport.authenticate('microsoft', { failureRedirect: '/login' }),
	function (req, res) {
		res.redirect('/');
	}
);

app.post('/logout', limiter, function (req, res, next) {
	req.logout(function (err) {
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
