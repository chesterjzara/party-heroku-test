//Basic Dependencies (npm packages: express, method-override, mongoose, dotenv)
const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
require('dotenv').config()
const app = express()
const session = require('express-session');
//const bcrypt = require('bcrypt')

// Configuration
const PORT = process.env.PORT
const mongoURI = process.env.MONGODB_URI

// Middleware
// allows us to use put and delete methods
app.use(methodOverride('_method'))
// parses info from our input fields into an object
app.use(express.urlencoded({ extended: false }))

//store session information for user login
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  }))

// Database
mongoose.connect(mongoURI, { useNewUrlParser: true })
mongoose.connection.once('open', () => {
  console.log('connected to mongo')
})

// Listen
app.listen(PORT, () => console.log('auth happening on port', PORT))

//////////////////////
//      Routes
//////////////////////

//Users controller route
const userController = require('./controllers/users_controller.js');
app.use('/users/', userController);
//Sessions controller route
const sessionController = require('./controllers/sessions_controller.js')
app.use('/sessions/', sessionController);

app.get('/', (req, res) => {
    res.render('index.ejs',{
        currentUser: req.session.currentUser
    })
});

const Message = require('./models/messages.js')

//Message Index GET
app.get('/app', (req, res) => {
    if(req.session.currentUser) {
        Message.find({}, (err, allMessages)=> {
            res.render('app/index.ejs', {
                allMessages: allMessages
            })
        })
    } else {
        res.redirect('/sessions/new')
    }
})

app.get('/app/messages/new', (req, res) => {
    if(req.session.currentUser) {
        res.render('app/messages/new.ejs', {
            currentUser: req.session.currentUser
        });
        
    } else {
        res.redirect('/sessions/new')
    }    
});

app.post('/app/messages', (req, res) => {
    if(req.session.currentUser) {
        req.body.author = req.session.currentUser;
        Message.create(req.body, (err, newMessage) => {
            res.redirect('/app');
        })
    } else {
        res.redirect('/sessions/new');
    } 
});