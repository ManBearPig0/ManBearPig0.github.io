// Import modules
import cors from 'cors';
import path from 'path';
import express from 'express';
import session from 'express-session';
import ejsextend from 'express-ejs-extend';
import fs from 'fs';
import BodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import FileStore from 'session-file-store';

import { convertDate } from './helpers/convertDate.js';

import { pageRoutes } from './routes/pageRoutes.js';
import { authRoutes } from './routes/authRoutes.js';
import { userRoutes } from './routes/userRoutes.js';
import { quizRoutes } from './routes/quizRoutes.js';

/** Config */
const {
    
    PORT = 3000,
    NODE_ENV = 'development',
    URL_BASE = "127.0.0.1",
    HTTPS = false,
    SESS_SECRET = "Sneaky keyboard cat",
    SESS_NAME = 'sid',
    SESS_LIFETIME = 60*60*2*1000,
} = process.env;

const IN_PROD = (NODE_ENV === 'production' && HTTPS);

/** Initialize with Express*/
const app = express()
let __dirname = path.resolve(path.dirname(''));

//  NOTE: What does cors do?
app.use(cors());

app.engine('ejs', ejsextend);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Cookie
let SesFileStore = FileStore(session);
app.use(cookieParser());

// Initalize Session
// app.set('trust proxy', 1) // trust first proxy
app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: IN_PROD, 
        sameSite: true,
        maxAge: SESS_LIFETIME 
        },
    secret: SESS_SECRET, // NOTE: GET CONFIG DATA
    store: new SesFileStore()
}));


/** Set Middelware */
// Parse HTML body values given with <input /> elements
app.use(BodyParser.urlencoded({ extended: true })); 

// Enable static files like css, javascript and assets.
app.use(express.static('public'));

// Logger
app.use((req, res, next) => {
    const currentDateTime = convertDate(new Date(), "DD-MM-YYYY HH:II:SS")

    let log = `\n${currentDateTime} ${req.method} request on ${req.hostname+req.path}
    params=${JSON.stringify(req.params)}
    content=${JSON.stringify(req.query)}
    `;
    fs.appendFile(`${__dirname}/storage/logs/request-logger.txt`, log, function(err, data) {
        if (err) throw err;
    });

    next();
});

// // Check if logged in.
app.use((req, res, next) => {

    console.log(req.session, req.sessionID);



    if (typeof req.session.loggedIn === 'undefined') {
        req.session.loggedIn = false;
    } 

    if (typeof req.session.user === 'undefined' || typeof req.session.loggedIn === 'undefined') {
        req.session.user = {
            name: "",
            id: null,
        };
    }

    next();
});



/** Set Routes */
app.use(pageRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use(quizRoutes);

// If no route found, return 404 error
app.use((req, res, next) => {
    res.status(404).render('errors/404', { path: req.path });
});



/** Start Application */
app.listen(PORT, () => console.log(`Application listening on virtual host: http://${URL_BASE}:${PORT}/`));