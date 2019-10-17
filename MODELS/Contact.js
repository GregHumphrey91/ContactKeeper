const mongoose = require('mongoose');

const ContactSchema = mongoose.Schema({
    // CREATES AN ASSOCIATION WITH THE OBJECT ID SO EACH CONTACT IS ASSIGNED TO ITS PARENT OBJECT ID WHICH IS THE USER
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    type: {
        type: String,
        default: "personal"
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('contact', ContactSchema);