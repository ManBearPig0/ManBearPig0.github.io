import express from 'express';
import BodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import UserModel from '../models/user.js';
import url from 'url';
import querystring from 'querystring';


const router = express.Router();

router.get('/logout', (req, res, next) => {
    // Log current user out.


    // Redirect to login
    res.redirect("/login");
});



router.post('/login', (req, res, next) => {
    
    // Validate input
    const schema = Joi.object({
        username:   Joi.string().required(),
        password:   Joi.string().required(),
    });
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };

    // Validate request body against schema
    const {error, value} = schema.validate(req.body, options);
    let field_errors = {};

    // Login user
    if (error) {
        // on fail return comma separated errors
        error.details.forEach(field => {
            field_errors[field.path[0]] = field.message;
        });

        res.redirect('/login?' + querystring.stringify(field_errors));
    } else {

        async function verifyUser(user) {
            // Check if user exists
            if (user) {
                if (await bcrypt.compare(value.password, user.password))  {
                    // Validated user! Login allowed
                    console.log("Success!");
                    req.session.loggedIn = true;
                    req.session.user = {
                        name: user.name,
                        id: user.id
                    };
                }
            } 

            res.redirect('/login?' + querystring.stringify({username: `Unknown username or password`}));
        }

        new UserModel().where(['name', value.username]).first(verifyUser);
    }


   
});


router.post('/register', async (req, res, next) => {
    
    // Validate input
    const schema = Joi.object({
        username:   Joi.string().required(),
        password:   Joi.string().min(6).required(),
        password_confirm: Joi.string().valid(Joi.ref('password')).required(),
    });

    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };

    // Validate request body against schema
    const {error, value} = schema.validate(req.body, options);
    let field_errors = {};

    function parseMessage(message) {
        return message.replace(`[ref:password]`, `same as "Password"`);
    }

    // Register user
    if (error) {
        // on fail return comma separated errors
        error.details.forEach(field => {
            field_errors[field.path[0]] = parseMessage(field.message);
        });

        console.log(field_errors);


    } else {
        // on success create user with hashed password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(value.password, salt);

        new UserModel().create({name: value.username, password: hashedPassword});

        res.redirect('/login');
    }

    res.redirect('/register?' + querystring.stringify(field_errors));
});


export const authRoutes = router;