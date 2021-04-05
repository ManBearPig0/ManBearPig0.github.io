// Import modules
import cors from 'cors';
import sqlite from 'sqlite3';
import path from 'path';
import express from 'express';
import ejsextend from 'express-ejs-extend';
import fs from 'fs';

import { convertDate } from './public/js/helpers/convertDate.js';

import { pageRoutes } from './routes/pageRoutes.js';
import { authRoutes } from './routes/authRoutes.js';
import { userRoutes } from './routes/userRoutes.js';
import { quizRoutes } from './routes/quizRoutes.js';

// import { routes } from './routes.js';

// const route = require('./routes.js');
const app = express()
const port = 3000
let __dirname = path.resolve(path.dirname(''));

// Setup Database
sqlite.verbose();
let db = new sqlite.Database('./storage/db/laravel.db', sqlite.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the laravel SQlite database file.');  
});



//  Use cors (Does something... )
app.use(cors());

// Initialize Handlebars
app.engine('ejs', ejsextend);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware

// Enable static files
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


// Define routes
app.use(pageRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use(quizRoutes);


// If no route found, return 404 error
app.use((req, res, next) => {
    console.log("Errors!?!?");
    res.status(404).render('errors/404', { path: req.path });
});

db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Closed the database connection.');
});

// Start application
app.listen(port, () => console.log(`Application listening on virtual host: http://127.0.0.1:${port}/`));

