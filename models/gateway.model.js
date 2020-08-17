var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const connection = require("./conn_db");

var gatewaySchema = new Schema({

    gid: {
        type: Number,
        required: true,
        unique: true
    },
    location: {
        type: String,
        default: ""
    },
    relay: [{
        rid: Number,
        detail: String,
        location: {
            type: String,
            default: ""
        },
        upThreshold: {
            type: Number,
            default: 30
        },
        downThreshold: {
            type: Number,
            default: 15
        }
    }],
    control: {
        type: String,
        required: true,
        enum: ['m', 'ts', 't', 't'],
        default: 't'
    },
    scheduleFlag: {
        type: Boolean,
        default: false
    },
    thermostatFlag: {
        type: Boolean,
        default: false
    },
    sensor: [{
        sid: Number,
        location: {
            type: String,
            default: ""
        }
    }],
    mapURL: String

});

//  { -> :  referes to }in control m -> manual, ts-> termostat/schedule, t-> termostat, s->schedule


module.exports = mongoose.model('gateway', gatewaySchema);