const mongoose = require('mongoose');
const User = require('./users.js')

const messageSchema = new mongoose.Schema({
    messageText: String,
    author: [User.schema]
}, {timestamps: true});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;