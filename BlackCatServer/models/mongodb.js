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
exports.DriveSchoolModel=require('./driveschool');
exports.TrainingFieldModel=require('./trainingfield');
exports.UserCountModel=require('./usercount');
exports.ClassTypeModel=require('./calsstype');
exports.CourseModel=require('./course');
exports.ReservationModel=require('./reservation');
exports.FeedBackModel=require("./feedback");
exports.HeadLineNewsModel=require("./headlinenews");
exports.UserInfoModel=require("./userinfo");
exports.QuestionModel=require('./question');
exports.SystemLogModel=require("./apierrorlog");
exports.VipServerModel=require("./vipserver");
exports.SequenceModel=require("./sequence");
exports.CourseWareModel=require("./courseware");
exports.IntegralListModel=require("./integrallist");
exports.MallProdcutsModel=require("./mallproducts");
exports.MallOrderModel=require("./mallorder");
exports.MerChantModel=require("./merchant");
exports.HeadMasterModel=require("./headmaster");
exports.IndustryNewsModel=require("./industrynews");
exports.SchoolDaySummaryModel=require("./schooldaylysummary");
exports.SchoolBulletin=require("./schoolbulletin");
exports.CityiInfoModel=require("./cityinfo");
exports.UserFcode=require("./purse/userFcode");
exports.SystemIncome=require("./purse/systemIncome");
exports.Coupon=require("./purse/coupon");
exports.IncomeDetails=require("./purse/incomeDetails");
exports.UserConsultModel=require("./userConsult");
exports.ActivityModel=require("./activity");
exports.CoachLeaveModel=require("./coachleave");
exports.UserCashOutModel=require("./purse/usercashout");
exports.CoachTagsModel=reqiure("./coachtags");
