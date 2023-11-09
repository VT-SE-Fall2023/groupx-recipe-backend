const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const recipemodel = require('../models/recipemodel');
const getGPTResponse = require('../helpers/generateReceipe');


router.get('/', async (req, res, next) => {
    const {ingredients} = req.body // parses json parameter called ingredients from the request body
    getGPTResponse(ingredients).then(resp => {
        // console.log(resp.choices[0].message.content)
        res.status(200).json({
            message: 'Ready to create recipe',
            data: JSON.parse(resp.choices[0].message.content)
        })
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