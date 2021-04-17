import express from 'express';

const router = express.Router();



router.get('/', (req, res, next) => {
    res.render("index", {path: req.path });
});

router.get('/assessment', (req, res, next) => {

    res.render("assessment", { path: req.path });
}); 

router.post('/assessment/save-question', (req, res, next) => {

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


export const pageRoutes = router;
