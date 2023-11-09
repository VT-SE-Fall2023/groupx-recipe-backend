const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const url = require('url')
// const recipeCollection = mongoose.collection('recipe')

const recipemodel = require('../models/recipemodel');
const getGPTResponse = require('../helpers/generateReceipe');
const storeRecipe = require("../helpers/storeRecipe")




// generates a recipe
router.get('/', async (req, res, next) => {
    const { ingredients, email } = req.body // parses json parameter called ingredients from the request body

    await getGPTResponse(ingredients).then(async resp => {
        // console.log('hiii')
        if (await storeRecipe(resp.choices[0].message.content, email)) {
            console.log(resp.choices[0].message.content)
            res.status(200).json(JSON.parse(resp.choices[0].message.content))
        } else {
            res.status(500).json({ "message": "Error Occured" })
        }
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
    ingredient.save().then(result => {
        console.log(result);
    })
        //Throw the error
        .catch(err => console.log(err));
    res.status(201).json({
        message: 'Recipes generated',
        ingredientSend: ingredient
    })
});

// router.get('/recipeHistory', (req, res, next) => {
//     var queryForHistory = url.parse(req.url).query
//     //Get data according to the model
//     var recipes = recipemodel.find({ email: queryForHistory.email }).toArray();
//     //A method use on mongo model to save to database
//     ingredient.
//     ingredient.save().then(result =>{
//         console.log(result);
//     })

//     //Throw the error
//     .catch(err => console.log(err));
//     res.status(201).json({
//         message: '',
//         ingredientSend: recipes
//     })
// })

module.exports = router;