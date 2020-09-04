//   Actuator ---> Broker-----> Server

/**
 * aid : actuator ID
 * sid: sensor id => 'a'+@aid+'s'+number
 *      for example if an actuator with aid : 1 contains two sensors 
 *      sids' of those sensors will be 'a1s1' and 'a1s2'.
 */


/**
 * Topic : /aid/sensor_status
 * Publisher: Actuator
 * Subscriber: Server
 * Description : Actuator sends the sensors data.
 * Message Body example: 
 * {
    time : '12/19/2012, 19:00:00',
    data : [
        {
        sid :'a1s1',
        humidity: 11,
        temperature:31
        },
        {
        sid :'a1s2',
        humidity: 13.2,
        temperature:31.07
        }
    ]
}
* Attention: There should be a valid range for reported parameters.
             For instance non of the sensors are not allowed to send negetive numbers
*/

sensor_status = {
    time: {
        type: String,
        required: true
    },
    data: [{
        sid: {
            type: String,
            required: true
        },
        humidity: {
            type: Number,
            required: true
        },
        temperature: {
            type: Number,
            required: true
        }
    }]
}

/**
 * Topic : /aid/system_log
 * Publisher: Actuator
 * Subscriber: Server
 * Description : Logs from accuators to server.
 *              Three level of logs: 
 *              (1)'info': success or routine messages.
 *                  Example : schedule set successfully
 *              (2)'warn': something went wrong but system is working properly.
 *                  Example: Server asked for control mode schedule however there is no schedule to be set.
 *              (3)'danger': (1) There is a problem and must be resolved.
 *                  Example:  No information from sid: 'a1s2' for more than 2 hours.
 *                         
 * 
 * Message Body example: 
 * {
 * system_log = {
    time: '12/19/2012, 19:00:00',
    level:'warn',
    description:'Server asked for control mode schedule however there is no schedule to be set.'
  }
}
*/


system_log = {

    time: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum:['danger', 'warn', 'info'],
        default: info
    },
    description:{
        type: String,
        required: true
    }
    //, there is no need to set this parameter in actuator section 
    // However we have this key value in our model used for web/mobile interface
    // seen: {
    //     type: Boolean,
    //     default: false
    // }
}