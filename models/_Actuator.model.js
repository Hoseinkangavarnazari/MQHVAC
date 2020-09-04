var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const connection = require("./conn_db");

/**
 * Actuator Schema containst the data related to each actutor,
 * Each actuator is related to set of sensors that are stored they spec in sensor list 
 * e.g., aid: '1'
 * sid: 'a'+aid+'s'+ Number. e.g., sid: "a1s2" == refers to ==> second sensor of the first actuator
 * In control mode reperesent how system should word due to the admin settings
 * Currently we shouldn't have schedule mode and it would be available in upcoming releases.
 */

var actuatorSchema = new Schema({
    aid: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        default: ""
    },
    conf: {
        controlMode: {
            type: String,
            required: true,
            enum: ['on', 'off', 'thermostat', 'schedule', 'schedule&thermostat'],
            default: 'thermostat'
        },
        thermostat: {
            max: {
                type: Number,
                default: 30
            },
            min: {
                type: Number,
                default: 15
            }
        },
        schedule: {
            saturday: [{
                start: {
                    type: String
                },
                end: {
                    type: String
                }
            }],
            sunday: [{
                start: {
                    type: String
                },
                end: {
                    type: String
                }
            }],
            monday: [{
                start: {
                    type: String
                },
                end: {
                    type: String
                }
            }],
            tuesday: [{
                start: {
                    type: String
                },
                end: {
                    type: String
                }
            }],
            wednesday: [{
                start: {
                    type: String
                },
                end: {
                    type: String
                }
            }],
            thursday: [{
                start: {
                    type: String
                },
                end: {
                    type: String
                }
            }],
            friday: [{
                start: {
                    type: String
                },
                end: {
                    type: String
                }
            }],
        },
        sensorsList: [{
            sid: {
                type: String,
                required:true
            },
            location: {
                type: String,
                default: ""
            }
        }]
    },
    mapURL: String
});

/**
 * currently just checks if there is an avalible shcedule 
 * To do: the currectness of schedule must be checked
 */
actuatorSchema.methods.shceduleAvailable = function () {
    if (this.conf.schedule.length > 0) {
        return true;
    } else {
        return false;
    }
}


/**
 * Validation Hook is needed
 * pre save and update: The correctness of schedule should be check 
 * for all elements in a schedule array end > start
 */


module.exports = mongoose.model('actuator', actuatorSchema);