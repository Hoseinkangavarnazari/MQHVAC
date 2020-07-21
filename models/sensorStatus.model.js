var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const connection = require("./conn_db");

var sensorStatusSchema = new Schema({
    GID: String,
    Time: String,
    sensors: [{
        SID: Number,
        temperature: Number,
        humidity: Number
    }]
});


module.exports = mongoose.model('sensorStatus', sensorStatusSchema);