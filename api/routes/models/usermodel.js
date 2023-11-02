const mongoose = require('mongoose')

const userschema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    //Restrict the attribute of data that can store to the database
    //If invalid then not stored    
    email: {type: String, required: true},
    password: {type: String, required: true} //This mean an array of string
});

//First variable will be the model that's going to fit
//and the second variable will be the const name
module.exports = mongoose.model('usermodel', userschema)