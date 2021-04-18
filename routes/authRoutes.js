import express from 'express';
const router = express.Router();


router.get('/logout', (req, res, next) => {
    // Log current user out.


    // Redirect to login
    res.redirect("/login");
});

router.get('/login', (req, res, next) => {

    res.render("login", { path: req.path });
});


router.post('/login-register', (req, res, next) => {

    // Validate input
    console.log("return ", req.query, req.params, req.body, req.username);

    // Login or register.

    res.redirect('/login');
});



export const authRoutes = router;