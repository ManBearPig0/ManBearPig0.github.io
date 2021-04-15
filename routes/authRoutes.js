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




export const authRoutes = router;
