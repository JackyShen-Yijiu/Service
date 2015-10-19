/**
 * Created by v-lyf on 2015/8/16.
 */

var mongoose = require("mongoose");

var dbcofing = require('../Config/DbConfig');

//var secrets = require(secretsFile);

//var dbURI = 'mongodb://localhost/test'
mongoose.connect(dbcofing.db.uri, dbcofing.db.options);

//var db = mongoose.connection;

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + dbcofing.db.uri);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

exports.ObjectId = mongoose.Types.ObjectId;
exports.close = function() {
    mongoose.connection.close();
}

exports.AppVersionModel = require('./appversion.js');
exports.SmsVerifyCodeModel = require('./smsVerifyCode.js');
exports.UserModel=require('./user');
exports.CoachModel=require('./coach');
exports.QuestionModel=require('./question');
exports.DriveSchoolModel=require('./driveschool');
exports.TrainingFieldModel=require('./trainingfield');
exports.UserCountModel=require('./usercount');
exports.ClassTypeModel=require('./calsstype');
exports.CourseModel=require('./course');
exports.ReservationModel=require('./reservation');
exports.FeedBackModel=require("./feedback");
