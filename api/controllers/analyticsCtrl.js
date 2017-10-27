/**
 * Created by victo on 7/24/2016.
 */

var Bird = require("bluebird");
var _analyticsModel = require('../models/analytics');
var _userModel = require('../models/users');

var analytics = {
    getAnalytics: function(cb){
        _analyticsModel.findById('59014b951156a02c782a155e',cb)
    },
    getUserCount: function(cb){
        _userModel.count({}, cb)
    },
    updateTokenCount: function(cb){
      analytics.getAnalytics(function(error, data){
         data.tokensCreated++;
          data.save(cb)
      })
    },
    updateLoginCount: function(cb){
        analytics.getAnalytics(function(error, data){
            data.loginsAttempted++;
            data.save(cb)
        })
    },
    updateSuccessLogin: function(cb){
        analytics.getAnalytics(function(error, data){
            data.loginSucceded++;
            data.save(cb)
        })
    },
    updateUserCount: function(cb){
        analytics.getUserCount(function(error, userCount){
            analytics.getAnalytics(function(error, data){
                data.userCount = data.userCount + userCount;
                data.save(cb)
            })
        })
    },
    updateServerCount: function(cb){
        analytics.getAnalytics(function(error, data){
            data.serverErrors++;
            data.save(cb)
        })
    }
};


module.exports = analytics;