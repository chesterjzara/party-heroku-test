const express = require('express');
const sessionRouter = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/users.js');

sessionRouter.get('/new', (req,res)=> {
    res.render('sessions/new.ejs');
})

sessionRouter.post('/', (req,res) => {
    User.findOne( {username: req.body.username}, (err, foundUser) => {
        if(bcrypt.compareSync(req.body.password, foundUser.password)){
            //foundUser.password === req.body.password
            req.session.currentUser = foundUser;
            res.redirect('/');
        } else {
            res.send('<a href="/">Wrong Password!</a>')
        }
    })
});

sessionRouter.delete('/', (req,res) => {
    req.session.destroy((err) => {
        if (err) {res.send(`<a href='/'>Error logging out</a>`) }
        else {
            res.redirect('/')
        }
    })
})

module.exports = sessionRouter;