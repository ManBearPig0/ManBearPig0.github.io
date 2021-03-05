// Import modules
import cors from 'cors';
import express from 'express';
import path from 'path';

const app = express()
const port = 3000

let __dirname = path.resolve(path.dirname(''));

console.log("BRBRBRBRBRBRB ", __dirname, path.join(__dirname, "public"));

//  Use cors (Does something... )
app.use(cors());

// Set public folder as static html website
app.use(express.static(path.join(__dirname, 'public')));


// Define routes
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "index.html"));
// });


// Start application
app.listen(port, () => console.log(`Application listening on virtual host: http://127.0.0.1:${port}/`));