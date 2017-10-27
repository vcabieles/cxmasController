/**
 * Created by victo on 5/27/2017.
 */

let Bird = require("bluebird");
let jwt = require('jsonwebtoken');
let config = require("../../config");
let uid = require('uuid/v4');

let helpers = {
    isValid: function(token){
        return new Promise(function(resolve,reject){
            jwt.verify(token, config.secret, function(err, decoded) {
                if(err){
                    console.log(err);
                    reject(err)
                }else{
                    resolve(decoded);
                }
            });
        })
    },
    serverError: function(res){
        res.status(500).json({
            status: "Error",
            transaction: "UNPAID",
            message: "Server Error Please Try Again Later"
        });
    },
    invalidToken: function(res){
        res.status(401).json({
            status: "ERROR",
            transaction: "UNPAID",
            message: "Authentication Has Failed. No Valid Key Provided."
        });
    },
    missingFields: function(res){
        res.status(409).json({
            status: "ERROR",
            transaction: "UNPAID",
            message: "Missing Fields"
        });
    },
    everythingOk: function(res,data){
        res.status(200).json({
            status: "OK",
            transaction: "PAID",
            data: data
        });
    },
    noCollections: function(res){
        res.status(404).json({
            status: "ERROR",
            transaction: "UNPAID",
            message: "No record found"
        });
    },
    verifyToken: function(res){
        res.status(401).json({
            status: "ERROR",
            transaction: "UNPAID",
            message: "Email Has Not Been Verified"
        });
    },
    noUser: function(res){
        res.status(404).json({
            status: "ERROR",
            transaction: "UNPAID",
            message: "There is no user by that username or email"
        });
    },

};


module.exports = helpers;