// Import modules
import http from 'http';
import cors from 'cors';
import path from 'path';
import express from 'express';
import ejs from 'ejs';
import ejsextend from 'express-ejs-extend';
import fs from 'fs';

import { convertDate } from './public/js/helpers/convertDate.js';

// import { routes } from './routes.js';

// const route = require('./routes.js');
const app = express()
    // const server = http.createServer(app);
const port = 3000

let __dirname = path.resolve(path.dirname(''));


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




// Set public folder as static html website
// app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res, next) => {
    let data = { someData: "what?" };

    res.render("index", data);
});

app.get('/assessment', (req, res, next) => {

    res.render("assessment");
});

app.post('/assessment/save-question', (req, res, next) => {

});

app.get('/contact', (req, res, next) => {

    res.render("contact");
});

app.get('/features', (req, res, next) => {

    res.render("features");
});

app.get('/history', (req, res, next) => {


    res.render("history");
});

app.get('/installation', (req, res, next) => {

    res.render("installation");
});

app.use((req, res, next) => {
    res.status(404).sendFile('./views/errors/404.html', { root: __dirname });
});


// Start application
app.listen(port, () => console.log(`Application listening on virtual host: http://127.0.0.1:${port}/`));