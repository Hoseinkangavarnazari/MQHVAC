var request = require("request");
var actuator = require("../models/_Actuator.model");


/**
 * method: PUT 
 * Auth: required
 * url: /actuator/edit_location
 * description: To update the location of actuator 
 */
exports.editLocation = async(req, res) => {}


/**
 * method: PUT
 * Auth: required
 * url: /actuator/control_conf
 * description: To change control mode and emergency call
 */
exports.controlConf = async(req, res) => {}


/**
 * method: PUT
 * Auth: required
 * url: /actuator/set_thermostat
 * description: To change max and min of thermostat
 */
exports.setThermostat = async(req, res) => {}


/**
 * method:PUT
 * Auth: required
 * url: /actuator/set_schedule
 * description: To set the schedule
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
 */
exports.removeAllSchedule = async(req, res) => {}