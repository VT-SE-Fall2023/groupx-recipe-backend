const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const url = require('url')
const recipemodel = require('../models/recipemodel');
const getGPTResponse = require('../helpers/generateReceipe');
const storeRecipe = require("../helpers/storeRecipe");
const { type } = require('os');
const validateEmail = (email) => {
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
}


// generates a recipe
router.post('/', async (req, res, next) => {
    const { ingredients, email } = req.body // parses json parameter called ingredients from the request body
    if (!ingredients) return res.status(400).send("Ingredients field required")
    if (!(typeof(ingredients) === 'object' && ingredients.length)) return res.status(400).send("Ingredients field must be array")
    if (email) {
        if (!validateEmail(req.body.email)) return res.status(400).send("Email address invalid")
    }
    if (ingredients.length <= 0) return res.status(400).send("0 Ingredients Porvided")
    await getGPTResponse(ingredients).then(async resp => {
        if (await storeRecipe(resp.choices[0].message.content, email)) {
            res.status(200).json(JSON.parse(resp.choices[0].message.content))
        } else {
            res.status(500).json({ "message": "Error Occured" })
        }
    }).catch(e => {
        console.log(e)
        res.status(500).json({ "message": "Error Occured" })
    })


});

// Rate recipe
router.post('/rate', async (req, res, next) => {
    const { id, rating } = req.body;
    if (!rating) return res.status(400).send("No rating field provided")
    if (!Boolean(Number(rating))) return res.status(400).send("Rating should be string number")
    if (!id) return res.status(400).send("No id field provided")
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("Invalid ID Format")
    if(typeof(rating) !== 'string') return res.status(400).send("Invalid rating Format, expected string")
    if (![1,2,3,4,5].includes(Number(rating)) && Number(rating) > 5) return res.status(400).send("Rating should be less than 6")
    if (![1,2,3,4,5].includes(Number(rating)) && Number(rating) < -1) return res.status(400).send("Rating should at least be 0")
    try {
        await recipemodel.updateOne(
            { _id: id },
            { $set: { rating: rating } }
        );
        res.status(200).send("Rating updated successfully");
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;