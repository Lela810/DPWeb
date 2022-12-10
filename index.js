require('dotenv').config();
const express = require('express'),
	passport = require('passport'),
	MicrosoftStrategy = require('passport-microsoft').Strategy,
	fs = require('fs'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	cors = require('cors'),
	cookieParser = require('cookie-parser'),
	MongoStore = require('connect-mongo'),
	path = require('path'),
	authRouter = require('./routes/authRouter'),
	detailprogrammeRouter = require('./routes/detailprogrammeRouter'),
	homeRouter = require('./routes/homeRouter'),
	inviteRouter = require('./routes/inviteRouter'),
	mailRouter = require('./routes/mailRouter'),
	indexRouter = require('./routes/indexRouter'),
	limiter = require('./js/middleware'),
	recipientsRouter = require('./routes/recipientsRouter');

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

const app = express();
const oneDay = 1000 * 60 * 60 * 24;
let sessionParams = {
	secret: process.env.SESSION_SECRET,
	saveUninitialized: true,
	cookie: { maxAge: oneDay },
	resave: false,
	store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
	mongoOptions: { useNewUrlParser: true },
};

let logStream = fs.createWriteStream(path.join(__dirname, 'current.log'), {
	flags: 'a',
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.set('trust proxy', 1);
app.use(
	morgan('short', {
		stream: logStream,
	})
);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(methodOverride());
app.use(session(sessionParams));
app.use(
	cors({
		origin: '*',
	})
);

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/auth/login');
}

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

app.use(limiter);
app.use('/auth', authRouter);
app.use('/detailprogramme', ensureAuthenticated, detailprogrammeRouter);
app.use('/home', ensureAuthenticated, homeRouter);
app.use('/invite', ensureAuthenticated, inviteRouter);
app.use('/mail', ensureAuthenticated, mailRouter);
app.use('/recipients', ensureAuthenticated, recipientsRouter);
app.use('/', indexRouter);

app.use(express.static(path.join(__dirname + '/public')));
app.use(
	'/tinymce',
	express.static(path.join(__dirname, 'node_modules', 'tinymce'))
);

app.listen(3000);

console.log('App running on http://localhost:3000');
