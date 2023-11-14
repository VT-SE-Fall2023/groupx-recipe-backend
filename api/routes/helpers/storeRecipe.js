const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const url = require('url')
const recipemodel = require('../models/recipemodel');

const storeRecipe = async (recipe, email) => {
    console.log(recipe, 'from the ')
    const {name, ingredients, instructions} = JSON.parse(recipe)
    const ingredient = new recipemodel({
        _id: new mongoose.Types.ObjectId(),
        email: email || "Anonymous@vt.edu",
        name,
        instructions,
        ingredients
    });
    //A method use on mongo model to save to database
    return await ingredient.save().then(result =>{
        return true
    })
    //Throw the error
    .catch(err => {
        console.log(err)
        return false
    });
}


module.exports = storeRecipe