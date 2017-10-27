/**
 * Created by victor on 7/16/2016.
 */
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require("../config");
var _userModel = require('./models/users');
var _analytics = require('./controllers/analyticsCtrl');
var Bird = require("bluebird");
var __ = require('lodash');
var validator = require('validator');


router.post('/register', function(req, res, next) {
    var _userInfo = req.body;
        if( __.isEmpty(_userInfo.email) || __.isEmpty(_userInfo.username) ){
            res.status(400).json({status: "Error", transaction: "UNPAID", message: "Required fields are missing." });
        }else{
            _userInfo.email = _userInfo.email.toLowerCase();
            _userInfo.username = _userInfo.username.toLowerCase();
            var _newUser = new _userModel(_userInfo);
            //Check to see if email is taken
            _newUser.isEmailTaken(function (err, data) {
                console.log(err, data, "is EmailTaken");

                if (data <= 0) {
                    //if the email is not taken check username
                    _newUser.isUsernameTaken(function (err, data){
                        console.log(data, "THIS IS THE DATA");
                        if (err) {
                            serverError()
                        }
                        if (data >= 1) {
                            // If the username is taken
                            res.status(400).json({
                                status: "Error",
                                transaction: "UNPAID",
                                message: "This Username Is Already in Use"
                            });
                            console.log(err, "Taken Username");
                        } else {
                            //is the username is not taken makeUid Add full name and hash password then save
                            _newUser.makeUid(function (err, data) {
                                if(err){
                                    serverError();
                                }
                                console.log(err, data)
                            });
                            _newUser.addFull(function (err, name) {
                                if(err){
                                    serverError();
                                }
                                console.log(err, name, "addFull")
                            });
                            _newUser.hashPassword(function (err, data) {
                                if(err){
                                    serverError();
                                }
                                console.log(err, data, "Hash")
                            });
                            _newUser.save(function (err) {
                                if(err){
                                    serverError();
                                }
                                jwt.sign(__.omit(_newUser.toObject(), ["password", "_id", '__v']), config.secret, {
                                    algorithm: 'HS256',
                                    expiresIn: "24H"
                                }, function (err, token) {
                                    console.log(token, err);
                                    if(err){
                                        serverError();
                                    }
                                    _analytics.updateTokenCount();
                                    _analytics.updateUserCount();
                                    res.status(201).json({status: "Ok", transaction: "PAID", token: token});
                                });

                            });
                        }
                    })

                }else{
                    res.status(400).json({
                        status: "Error",
                        transaction: "UNPAID",
                        message: "This Email Is Already In Use."
                    });
                }
            });
        }
    function serverError(){
        _analytics.updateServerCount();
        res.status(500).json({
            status: "Error",
            transaction: "UNPAID",
            message: "Server Error Please Try Again Later"
        });
    }
});

router.post('/login', function(req, res, next) {
    _analytics.updateLoginCount();
    var _userInfo = req.body;
    if( __.isEmpty(_userInfo.loginName) ){
        res.status(400).json({status: "Error", transaction: "UNPAID", message: "Required fields are missing." });
    }else {
        _userInfo.loginName = _userInfo.loginName.toLowerCase();
        if(validator.isEmail(_userInfo.loginName,{require_tld: false})){
            _userModel.findOne({email: _userInfo.loginName}, function (err, data) {
                if (err) {
                    serverError();
                }
                if(__.isNil(data)){
                    noUser()
                }else{
                    if(!data.checkPassword(_userInfo.password)){
                        res.status(400).json({
                            status: "Error",
                            transaction: "UNPAID",
                            message: "Wrong Password."
                        });

                    }else{
                        makeToken(data)
                    }
                }
            })
        }else{
            _userModel.findOne({username: _userInfo.loginName}, function (err, data) {
                if(__.isNil(data)){
                    noUser()
                }else{
                    if(!data.checkPassword(_userInfo.password)){
                        res.status(400).json({
                            status: "Error",
                            transaction: "UNPAID",
                            message: "Wrong Password."
                        });

                    }else{
                        makeToken(data)
                    }
                }
            })
        }
    }

    function makeToken(map) {
        jwt.sign(__.omit(map.toObject(), ["password", "_id", '__v']), config.secret, {
            algorithm: 'HS256',
            expiresIn: "24H"
        }, function (err, token) {
            console.log(token, err);
            if(err){
                serverError();
            }
            _analytics.updateTokenCount();
            _analytics.updateSuccessLogin();
            res.status(201).json({status: "Ok", transaction: "PAID", token: token});
        });
    }

    function noUser(){
        res.status(400).json({
            status: "Error",
            transaction: "UNPAID",
            message: "There is no user by that email or username"
        });
    }

    function serverError(){
        _analytics.updateServerCount();
        res.status(500).json({
            status: "Error",
            transaction: "UNPAID",
            message: "Server Error Please Try Again Later"
        });
    }
});


router.post('/newToken', function(req, res, next) {
    var _token = req.body.token;
    if(__.isNil(_token)){
        res.status(400).json({status: "Error", transaction: "UNPAID", message: "Required Fields missing"});
    }else {
        jwt.verify(_token, config.secret, function (err, decoded) {
            if (err) {
                res.status(400).json({
                    status: "Error",
                    transaction: "UNPAID",
                    message: err.message,
                    meta: err
                });
            } else {
                jwt.sign(__.omit(decoded, ["iat", "exp"]), config.secret, {
                    algorithm: 'HS256',
                    expiresIn: "24H"
                }, function (err, token) {
                    if (err) {
                        serverError();
                    }
                    _analytics.updateTokenCount();
                    res.status(201).json({status: "Ok", transaction: "PAID", token: token});
                });
            }
        });
    }
    function serverError(){
        _analytics.updateServerCount();
        res.status(500).json({
            status: "Error",
            transaction: "UNPAID",
            message: "Server Error Please Try Again Later"
        });
    }
});

module.exports = router;
