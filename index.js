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
	cookieParser = require('cookie-parser'),
	MongoStore = require('connect-mongo'),
	path = require('path');

const app = express();
const oneDay = 1000 * 60 * 60 * 24;
let sessionParams = {
	secret: process.env.SESSION_SECRET,
	saveUninitialized: true,
	cookie: { maxAge: oneDay },
	resave: false,
};

if (!process.env.DEV) {
	const mongoDBUrl = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB}/DPWEB`;

	mongoose.connect(mongoDBUrl, {
		useNewUrlParser: true,
	});
	Object.assign(sessionParams, {
		store: MongoStore.create({ mongoUrl: mongoDBUrl }),
		mongoOptions: { useNewUrlParser: true },
	});
	app.set('trust proxy', 1);
	sessionParams.cookie.secure = true;
} else {
	const mongoDBUrl = `mongodb://${process.env.MONGODB}/DPWEB`;
	mongoose.connect(mongoDBUrl, { useNewUrlParser: true });
	Object.assign(sessionParams, {
		store: MongoStore.create({
			mongoUrl: mongoDBUrl,
			mongoOptions: { useNewUrlParser: true },
		}),
	});
	app.use(morgan('dev'));
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
			clientID: process.env.MICROSOFT_GRAPH_CLIENT_ID,
			clientSecret: process.env.MICROSOFT_GRAPH_CLIENT_SECRET,
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

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cookieParser());
app.use(methodOverride());
app.use(session(sessionParams));
app.use(
	cors({
		origin: '*',
	})
);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoute.js')(app, passport, limiter);
require('./routes/detailprogrammeRoute.js')(app, ensureAuthenticated, limiter);
require('./routes/mailRoute.js')(app, ensureAuthenticated, limiter);
require('./routes/recipientsRoute.js')(app, ensureAuthenticated, limiter);
require('./routes/inviteRoute.js')(app, limiter);
require('./routes/homeRoute.js')(app, ensureAuthenticated, limiter);

app.use(express.static(__dirname + '/public'));
app.use(
	'/tinymce',
	express.static(path.join(__dirname, 'node_modules', 'tinymce'))
);

app.listen(3000);

console.log('App running on http://localhost:3000');

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}
