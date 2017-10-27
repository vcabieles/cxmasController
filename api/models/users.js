/**
 * Created by victo on 7/16/2016.
 */
var Bird = require("bluebird"),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    timestamps = require('mongoose-timestamp'),
    bcrypt = require('bcrypt'),
    uid = require('node-uuid');

var userSchema = new Schema({
    firstName: String,
    lastName: String,
    fullName: String,
    uid: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    meta: Object

});

userSchema.methods.addFull = function(){
    return this.fullName = this.firstName + " " + this.lastName;
};
userSchema.methods.isEmailTaken = function(cd){
    this.email = this.email.toLowerCase();
    return this.model('User').count({email: this.email}, cd);
};
userSchema.methods.isUsernameTaken = function(cd){
    this.username = this.username.toLowerCase();
    return this.model('User').count({username: this.username}, cd);
};
userSchema.methods.hashPassword = function(cb){
    if (!this.password) return '';
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(this.password, salt);
    return this.password = hash;
};

userSchema.methods.checkPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
};

userSchema.methods.makeUid = function(){
    return this.uid = uid.v4();
};

userSchema.plugin(timestamps);
var User = mongoose.model('User', userSchema);

module.exports = User;