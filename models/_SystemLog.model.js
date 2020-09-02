var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const connection = require("./conn_db");

var SystemLogSchema = new Schema({
    aid: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum:['danger', 'warn', 'info'],
        default: info
    },
    seen : {
        type: Boolean,
        default: false
    }
});

/**
 * Validation Hook is needed
 * pre save: The correctness of aid and time range should be checked 
 */

module.exports = mongoose.model('SystemLog', SystemLogSchema);