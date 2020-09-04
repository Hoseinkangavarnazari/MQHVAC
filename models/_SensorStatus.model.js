var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const connection = require("./conn_db");


/**
 * Sensor Status Schema contains all received data from actuator (cumulative)
 * Or from sensors itself (in case of one sensor - one acctuator)
 */
var sensorStatusSchema = new Schema({
    aid : {
        type: String,
        required: true
    },
    time : {
        type: String,
        required: true
    },
    data : [{
        sid : {
            type: String,
            required: true
        },
        humidity: {
            type: Number,
            required: true
        },
        temperature:{
            type: Number,
            required: true
        }
    }]

})


/**
 * Validation Hook is needed
 * pre save: The correctness of
 * (1) time should be in a resonable range
 * (2) Humidity and temperature should be in a resonable range
 * (3) aid must be valid
 */ 

module.exports = mongoose.model('sensorstatus', sensorStatusSchema);