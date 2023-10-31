const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const recipemodel = require('../models/recipemodel');


router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Ready to create recipe'
    })
});

router.post('/', (req, res, next) => {
    //Get data according to the model
    const ingredient = new recipemodel({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        ingredientName: req.body.ingredientName
    });
    //A method use on mongo model to save to database
    ingredient.save().then(result =>{
        console.log(result);
    })
    //Throw the error
    .catch(err => console.log(err));
    res.status(201).json({
        message: 'Recipes generated',
        ingredientSend: ingredient
    })
});

module.exports = router;