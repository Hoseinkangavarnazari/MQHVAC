var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const connection = require("./conn_db");


var reportSchema = new Schema({
    y: Number,
    m: Number,
    d: Number,
    aid: {
        type: String,
        required: true
    },
    data: [{
        avgTemperature: Number,
        avgHumidity: Number,
        sid: {
            type: String,
            required: true
        },
        humidity: [{
            value: Number,
            count: Number
        }],
        temperature: [{
            value: Number,
            count: Number
        }]
    }]

})

module.exports = mongoose.model('report', reportSchema);