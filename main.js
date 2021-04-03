// Import modules
import cors from 'cors';
import express from 'express';
import path from 'path';
import hbs from 'hbs';


const app = express()
const port = 3000

let __dirname = path.resolve(path.dirname(''));

//  Use cors (Does something... )
app.use(cors());

// Set public folder as static html website
app.use(express.static(path.join(__dirname, 'public')));


app.set('views', path.join(__dirname, 'resources/views'));
app.set('view engine', 'hbs');

// app.engine('hbs', hbs.express3({
//     partialsDir: __dirname + '/views/partials'
// }));
hbs.registerPartials(__dirname + '/resources/views/partials', function(err) {});

// Define routes
app.get('/', (req, res) => {
    let data = { someData: "what?" };
    res.render("index", data);
});

app.get('/assessment', (req, res) => {
    res.render("assessment");
});

app.get('/contact', (req, res) => {
    res.render("contact");
});

app.get('/features', (req, res) => {
    res.render("features");
});

app.get('/history', (req, res) => {
    res.render("history");
});
app.get('/installation', (req, res) => {
    res.render("installation");
});

// Start application
app.listen(port, () => console.log(`Application listening on virtual host: http://127.0.0.1:${port}/`));