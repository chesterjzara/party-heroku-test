const express = require('express');
const userRouter = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/users.js');

//New 
userRouter.get('/new', (req,res) => {
    res.render('users/new.ejs')
});
//Create
userRouter.post('/', (req,res) => {
    
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    
    User.create(req.body, (err, createdUser)=> {
        if(err) {
            console.log(err);
        }
        console.log(createdUser);
        res.redirect('/');
    })
})

module.exports = userRouter;