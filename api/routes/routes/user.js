const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); //A library to hash the password
const jwt = require('jsonwebtoken'); //A library to create token

const usermodel = require('../models/usermodel');
const recipemodel = require('../models/recipemodel');
const { default: mongoose } = require('mongoose');
const { token } = require('morgan');

//User Login
router.post('/login', (req, res, next) => {
    usermodel.find({email: req.body.email}).exec()
        .then(user => {
            //If we cannot find a user
            if(user.length < 1){
                return res.status(401).json({
                    message: 'Failed to Loggin'
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                //Server error
                if(err){
                    return res.status(401).json({
                        message: 'Failed to Loggin'
                    })
                }
                //Email correct and Password correct
                if(result){
                    const token = jwt.sign({
                        email: user.email,
                        userID: user[0]._id
                    }, process.env.JWT_KEY, {
                        expiresIn: "1h"
                    })
                    return res.status(200).json({
                        message: 'Login in',
                        token: token
                    });
                }
                //Email correct but password wrong
                return res.status(500).json({
                    message: 'Failed to Loggin'
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//User create new account
router.post('/register',(req, res, next) => {
    //Check if the email has already exist in DB or not
    usermodel.find({email: req.body.email}).exec()
        .then(user => {
            if(user.length >= 1){
                //return 409 = server can't process request
                return res.status(409).json({
                    message: 'Mail exists'
                })
            }else{
                //===========================================
                //Function to hash the user password
                //===========================================
                bcrypt.hash(req.body.password,10,(err,hash) => {
                    if(err){
                        return res.status(500).json({
                            error: err
                        });
                    }else{
                        const user = new usermodel({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            //Use the password that's been hashed to store into DB
                            password: hash
                        })
                        user.save()
                        .then(result => {
                            console.log(result);
                            return res.status(201).json({
                                message: 'Account created'
                            })
                        })
                        .catch(error => {
                            console.log(error);
                            return res.status(500).json({
                                err: error
                            })
                        });
                    }
                })
            }
        }).catch()
});

// 
router.post('/recipeHistory', async (req, res, next) => {
    const {email} = req.body
    await recipemodel.find({email}).then((docs) => res.status(200).json(docs)).catch((err) => console.log(err))
})

module.exports = router;