import express from 'express';

const router = express.Router();



router.get('/', (req, res, next) => {

    // Cookie example
    // res.cookie('email', 'some@email.com', { expires: new Date(Date.now() + 365*24*60*60*1000), httpOnly: true})
    // let email = req.cookies.email;
    // res.clearCookie('email');

    res.render("index", {path: req.path, loggedIn: req.session.loggedIn, user: req.session.user });
});

router.get('/assessment', (req, res, next) => {

    res.render("assessment", { path: req.path, loggedIn: req.session.loggedIn, user: req.session.user });
}); 

router.get('/contact', (req, res, next) => {

    res.render("contact", { path: req.path, loggedIn: req.session.loggedIn, user: req.session.user });
});

router.get('/features', (req, res, next) => {
    
    res.render("features", { path: req.path, loggedIn: req.session.loggedIn, user: req.session.user });
});

router.get('/history', (req, res, next) => {

    res.render("history", { path: req.path, loggedIn: req.session.loggedIn, user: req.session.user });
});

router.get('/installation', (req, res, next) => {

    res.render("installation", { path: req.path, loggedIn: req.session.loggedIn, user: req.session.user });
});

router.get('/login', (req, res, next) => {

    let errored_fields = req.query;

    res.render("login", { path: req.path, ...errored_fields, loggedIn: req.session.loggedIn, user: req.session.user });
});

router.get('/register', (req, res, next) => {

    let errored_fields = req.query;

    res.render("register", { path: req.path, ...errored_fields, loggedIn: req.session.loggedIn, user: req.session.user });
});



export const pageRoutes = router;
