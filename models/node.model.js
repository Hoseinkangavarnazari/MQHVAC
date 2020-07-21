var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const connection = require("./conn_db")

// var nodeSchema = new Schema({
//     IP: String, //check by regex
//     ID: String, //check by regex

//     currentStatus:{
//         status : { type: Boolean, default: true } , 
//         setPoint: { type: Number, default: 23 }
//     },
//     feedbackBan: {type: Boolean , default:false}
// });


// var nodeSchema = new Schema({
//     IP: String, //check by regex
//     PORT: String, //check by regex
//     location: String,
//     sensorCounter: Number,
//     user: [
//         {
//             username: String,
//             password: String,
//             sensorID: String,
//             feedback: {
//                 data: {
//                     temprature: String
//                 },

//                 date: String
//             }
//         }
//     ]
//     ,

//     // currentStatus:{
//     //     status : { type: Boolean, default: true } , 
//     //     setPoint: { type: Number, default: 23 }
//     // },
//     feedbackBan: { type: Boolean, default: false }
// });


var nodeSchema = new Schema({
    GID: Number,
    sensors: [{
        SID: Number,
        temperature: Number,
        humidity: Number
    }]
});


module.exports = mongoose.model('Node', nodeSchema);