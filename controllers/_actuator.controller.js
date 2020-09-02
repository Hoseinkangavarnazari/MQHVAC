var request = require("request");
var Actuator = require("../models/_Actuator.model");


/**
 * method: PUT 
 * Auth: required
 * url: /actuator/edit_location
 * description: 
 * (1) changes the location of requested aid
 */
exports.editLocation = async(req, res) => {}


/**
 * method: PUT
 * Auth: required
 * url: /actuator/control_conf
 * description: 
 * (1) changes the control configuration of requested actuator in db
 * (2) publishes into MQTT topic:  /aid/control_conf
 */
exports.controlConf = async(req, res) => {}


/**
 * method: PUT
 * Auth: required
 * url: /actuator/set_thermostat
 * description:
 * (1) changes the defined range for thermostat (min & max) for requested aid
 * (2) publishes into MQTT topic: /aid/set_thermostat
 */
exports.setThermostat = async(req, res) => {}


/**
 * method:PUT
 * Auth: required
 * url: /actuator/set_schedule
 * description:
 * (1) updates or sets schedule for requested aid 
 * (2) publishes new schedule into MQTT topic:  /aid/set_schedule
 */
exports.setSchedule = async(req, res) => {}



/**
 * method: GET
 * Auth: required
 * url: /actuator/spec
 * description: Returns the actuator object
 */
exports.getSpec = async(req, res) => {}



/**
 * method: DELETE
 * Auth: required
 * url: /actuator/remove_schedule
 * description: 
 * (1) Removes schedule from requested actuator
 * (2) Changes conf.control into thermostat if the current control mode
 *     is schedule or schedule&thermostat
 * (3) publishes empty schedule into MQTT topic /aid/set_schedule
 * (4) publishes new control mode if needed in /aid/control_conf
 */
exports.removeSchedule = async(req, res) => {}

/**
 * method: DELETE
 * Auth: required
 * url: /actuator/remove_all_schedules
 * description: 
 * (1) Removes schedule from all actuators
 * (2) Changes conf.control into thermostat if the current control mode
 *     is schedule or schedule&thermostat
 * (3) publishes empty schedule into MQTT topic /+/set_schedule
 * (4) publishes new control mode if needed in /+/control_conf
 * Attention: '+' is a single level wildcard
 */
exports.removeAllSchedule = async(req, res) => {}