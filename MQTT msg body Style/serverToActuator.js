//   Server ---> Broker-----> Actuator

/**
 * Variables:
 * aid : actuator id
 */


/**
 * Topic : /aid/control_conf
 * Publisher: Server
 * Subscriber: Actuator
 * Description : Modifies/Controls the "control mode" of the actuator (specified in aid)
 * There are several control mode for each actuator:
 * Thermostat: Every actuator has a range - minimum and maximum. The actuator role is to make sure that the mentioned paramter is in the range.
 * Schedule: For each day, system must works from a specific time e.g., 4.00 AM to 5.00 PM 
 * Schedule&thermostat: Makes sure that in specified range of times, keeps the related parameters in defined range by thermostat.
 * on: Admin can enforce an actuator to be turned on (without any restrictions)
 * off:Admin can enforce an actuator to be turned off (without any restrictions)
 * Attention : for changing the "Contorl mode" from X to (schedule or schedule&thermostat) : schedule must be defined otherwise default
 *              There is a default value for thermostat. It cannot be NULL. 
 * Message Body example: 
 * {'control_mode' : 'thermostat'}
 */

control_conf = {
    control_mode: {
        type: String,
        enum: ['thermostat', 'schedule', 'schedule&thermostat', 'on', 'off'],
        required: true
    }
}


/**
 * Topic : /aid/set_schedule
 * Publisher: Server
 * Subscriber: Actuator
 * Description : Sends an schedule for aid. Repeatition duration: 1 week
 *               Repetation for month/year can be interpreted in webServer
 *               and sent weekly to the actuators (Memory related issues)
 * Message Body example: 
 * {'monday' : [
 *              {'start': '1:00','end':'2:00'},
 *              {'start': '8:30','end':'14:45'},
 *            ],
 * 'sunday' : [
 *              {'start': '1:00','end':'2:00'},
 *              {'start': '8:30','end':'14:45'},
 *            ],
 * 'friday' : [
 *              {'start': '1:00','end':'2:00'},
 *              {'start': '8:30','end':'14:45'},
 *            ]
 * ,'wednesday' : [
 *              {'start': '1:00','end':'2:00'},
 *              {'start': '8:30','end':'14:45'},
 *            ]
 * 
 * }
 * Attention: For each start there must be an end :D otherwise You should drop that sepecific obj
 */

schedule = {
    schedule: {
        saturday: [{
            start: {
                type: String,
                required: true
            },
            end: {
                type: String,
                required: true
            }
        }],
        sunday: [{
            start: {
                type: String,
                required: true
            },
            end: {
                type: String,
                required: true
            }
        }],
        monday: [{
            start: {
                type: String,
                required: true
            },
            end: {
                type: String,
                required: true
            }
        }],
        tuesday: [{
            start: {
                type: String,
                required: true
            },
            end: {
                type: String,
                required: true
            }
        }],
        wednesday: [{
            start: {
                type: String,
                required: true
            },
            end: {
                type: String,
                required: true
            }
        }],
        thursday: [{
            start: {
                type: String,
                required: true
            },
            end: {
                type: String,
                required: true
            }
        }],
        friday: [{
            start: {
                type: String,
                required: true
            },
            end: {
                type: String,
                required: true
            }
        }]
    }
}


/**
 * Topic : /aid/set_thermostat
 * Publisher: Server
 * Subscriber: Actuator
 * Description : Sends thermostat range for the specified actuator (aid).
 * Message Body example: 
 *     thermostat: {
        max: 19,
        min: 15
        }
 * Attention : Default will be set from config file.
 *             Acctuator must NOT accept values more than max and less than min.
 */

 set_thermostat= {
    thermostat: {
        max: {
            type: Number,
            default: 30
        },
        min: {
            type: Number,
            default: 15
        }
    }
 }