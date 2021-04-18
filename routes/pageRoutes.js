import express from 'express';

const router = express.Router();



router.get('/', (req, res, next) => {
    res.render("index", {path: req.path });
});

router.get('/assessment', (req, res, next) => {

    res.render("assessment", { path: req.path });
}); 

router.get('/contact', (req, res, next) => {

    res.render("contact", { path: req.path });
});

router.get('/features', (req, res, next) => {

    res.render("features", { path: req.path });
});

router.get('/history', (req, res, next) => {


    res.render("history", { path: req.path });
});

router.get('/installation', (req, res, next) => {

    res.render("installation", { path: req.path });
});

router.get('/login', (req, res, next) => {

    let errored_fields = req.query;

    res.render("login", { path: req.path, ...errored_fields });
});

router.get('/register', (req, res, next) => {

    let errored_fields = req.query;

    res.render("register", { path: req.path, ...errored_fields });
});



export const pageRoutes = router;
