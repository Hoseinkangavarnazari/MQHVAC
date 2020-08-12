var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const connection = require("./conn_db");

var emergencyCallSchema = new Schema({
    GID: String,
    time: String,
    sj: String,
    command: String
});


module.exports = mongoose.model('emergencyCall', emergencyCallSchema);