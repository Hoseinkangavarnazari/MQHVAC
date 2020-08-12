var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const connection = require("./conn_db");

var logSchema = new Schema({
    GID: String,
    Time: String,
    Mode: String,
    Detail:String,
    seen:Boolean
});


module.exports = mongoose.model('log', logSchema);