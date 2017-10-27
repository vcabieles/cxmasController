/**
 * Created by victo on 7/24/2016.
 */
var Bird = require("bluebird"),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AnalyticsSchema = new Schema({
    tokensCreated: Number,
    loginsAttempted: Number,
    userCount: Number,
    serverErrors: Number,
    loginSucceded: Number
});

var Analytics = mongoose.model('Analytics', AnalyticsSchema);

module.exports = Analytics;