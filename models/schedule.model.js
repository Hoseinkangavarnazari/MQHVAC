var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const connection = require("./conn_db");

var scheduleSchema = new Schema({
    GID: String,
    Time: String,
    SJ: String,
    saturday:[],
    sunday:[],
    monday:[],
    tuesday:[],
    wednesday:[],
    thursday:[],
    friday:[],
});


module.exports = mongoose.model('schedule', scheduleSchema);