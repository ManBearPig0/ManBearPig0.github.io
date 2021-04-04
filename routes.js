import path from 'path';
import express from 'express';

const router = express.Router();

// router.get('/add-username', (req, res,next)=>{
//    // res.send('<form action="/test/post-username" method="POST"> <input type="text" name="username">    <button type="submit"> Send </button> </form>');
//    res.sendFile(path.join(__dirname, 'views', 'add-user.html'));
// });


// router.post('/post-username', (req, res, next)=>{
//    console.log('data: ', req.body.username);
//    res.send('<h1>'+req.body.username+'</h1>');
// });

// Define routes
router.get('/', (req, res, next) => {
    let data = { someData: "what?" };

    res.render("index", data);
});

router.get('/assessment', (req, res, next) => {

    res.render("assessment");
});

router.post('/assessment/save-question', (req, res, next) => {

});

router.get('/contact', (req, res, next) => {

    res.render("contact");
});

router.get('/features', (req, res, next) => {

    res.render("features");
});

router.get('/history', (req, res, next) => {


    res.render("history");
});

router.get('/installation', (req, res, next) => {

    res.render("installation");
});

export const routes = router;