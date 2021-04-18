// Import modules
import cors from 'cors';
import path from 'path';
import express from 'express';
import ejsextend from 'express-ejs-extend';
import fs from 'fs';
import BodyParser from 'body-parser';
import random from 'random';
import bcrypt from 'bcrypt';

bcrypt.random();

import { convertDate } from './helpers/convertDate.js';

import { pageRoutes } from './routes/pageRoutes.js';
import { authRoutes } from './routes/authRoutes.js';
import { userRoutes } from './routes/userRoutes.js';
import { quizRoutes } from './routes/quizRoutes.js';


/** Initialize with Express*/
const app = express()
const port = 3000
let __dirname = path.resolve(path.dirname(''));

//  NOTE: What does cors do?
app.use(cors());

app.engine('ejs', ejsextend);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Initalize Session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    genid: function(req) {
        return genuuid() // use UUIDs for session IDs
    },
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
  secret: 'sneaky keyboard cat', // NOTE: GET CONFIG DATA
}))


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

// Check if logged in.
app.use((req, res, next) => {
    if (!req.session.loggedIn) {
        req.session.loggedIn = false;
    } 
    
    if (!req.session.user || !req.session.loggedIn) {
        req.session.user = {
            name: "",
            id: null,
        };
    }
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
app.listen(port, () => console.log(`Application listening on virtual host: http://127.0.0.1:${port}/`));