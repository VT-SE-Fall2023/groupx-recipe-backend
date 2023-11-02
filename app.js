const express = require('express'); //import the package express
const app = express(); //execute express so can use any methods in express
const morgan = require('morgan'); //import the package morgan package
const bodyParser = require('body-parser'); //import the package body-parser package
const mongoose = require('mongoose');

//======================================
//Connect to mongo database
//======================================
mongoose.connect('mongodb+srv://CCH:' +
    // process.env.mongo_atlas_pw + 
    'CCH' +
    '@cluster0.it1bibt.mongodb.net/?retryWrites=true&w=majority',
    {
        //To use mongoclient
        useNewUrlParser: true, // Use the new URL parser
        useUnifiedTopology: true, // Use the new Server Discover and Monitoring engine
    });

//==========================================
//Import routers
//==========================================
const recipeRoutes = require('./api/routes/routes/recipe');
const userRoutes = require('./api/routes/routes/user');


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false })); //extended true to parse rich data
//extract json data
app.use(bodyParser.json());
//To allow client from different port

//========================================================
//To find out what request come to server then add header
//=========================================================
app.use((req, res, next) => {
    //Adjust the header to allow CROS
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    //Browser will always send a OPTION request to see if it can do so
    if (req.method === 'OPTIONS') {
        //Tell the browser what it may send
        res.header('Access-Control-Allow-Methods', 'Get,POST,DELETE,PUT,PATCH');
        //Find what request server get
        return res.status(200).json({});
    }
    //Let other mid-ware to take over after adding header
    next();
});

//=======================================================
//Routes that should handle requests
//=======================================================
app.use('/recipe', recipeRoutes);
app.use('/user', userRoutes);

//The middle ware that catch all the income that's not caught by mid-ware above
app.use((req, res, next) => {
    const error = new Error('Not found');
    //Income requese can't find fitting route
    error.status = 404;
    //Foward the request and the error
    next(error);
})

app.use((error, req, res, next) => {
    //Send back if not 404(from mid-ware above), 500
    res.status(error.status || 500);
    //Send the error as json format
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;