import dotenv from 'dotenv';
import express from 'express';
import passport from 'passport';
import { Strategy } from 'passport-microsoft';
import fs from 'fs';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import path from 'path';
import { authRouter, detailprogrammeRouter, homeRouter, inviteRouter, mailRouter, indexRouter, recipientsRouter, activitiesRouter, } from './routes/index.js';
import { limiter, errorHandler } from './js/middleware.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: '../.env' });
const app = express();
const oneDay = 1000 * 60 * 60 * 24;
const logStream = fs.createWriteStream(path.join(__dirname, 'current.log'), {
    flags: 'a',
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.set('trust proxy', 1);
app.use(morgan('short', {
    stream: logStream,
}));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(methodOverride());
app.use(cors({
    origin: '*',
}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
}));
passport.use(new Strategy({
    clientID: process.env.MICROSOFT_GRAPH_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_GRAPH_CLIENT_SECRET,
    scope: ['user.read', 'mail.send'],
    authorizationURL: 'https://login.microsoftonline.com/9cb1f9b2-0d99-4462-b36d-ddff5e60eb35/oauth2/v2.0/authorize',
    tokenURL: 'https://login.microsoftonline.com/9cb1f9b2-0d99-4462-b36d-ddff5e60eb35/oauth2/v2.0/token',
}, function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        return done(null, profile);
    });
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
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
app.use('/activities', ensureAuthenticated, activitiesRouter);
app.use('/', indexRouter);
app.use(errorHandler);
app.use(express.static(path.join(__dirname, './public')));
app.use('/tinymce', ensureAuthenticated, express.static(path.join(__dirname, '../node_modules', 'tinymce')));
app.listen(3000);
console.log('App running on http://localhost:3000');