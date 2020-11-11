var express = require('express');
var actuator_router = express.Router();

const passport = require("passport");
const passportConfig = require("../passport");

var actuator_controller = require('../controllers/_actuator.controller');

actuator_router.put('/edit_location',
passport.authenticate('jwt', { session: false }),
actuator_controller.editLocation);

actuator_router.put('/control_conf',
passport.authenticate('jwt', { session: false }),
actuator_controller.controlConf);

actuator_router.put('/set_thermostat',
passport.authenticate('jwt', { session: false }),
actuator_controller.setThermostat);

actuator_router.put('/set_schedule',
passport.authenticate('jwt', { session: false }),
actuator_controller.setSchedule);


actuator_router.put('/actuate_mode',
passport.authenticate('jwt', { session: false }),
actuator_controller.actuateMode);


actuator_router.post('/spec',
passport.authenticate('jwt', { session: false }),
actuator_controller.getSpec);

actuator_router.delete('/remove_schedule',
passport.authenticate('jwt', { session: false }),
actuator_controller.removeSchedule);

actuator_router.delete('/remove_all_schedules',
passport.authenticate('jwt', { session: false }),
actuator_controller.removeAllSchedule);


module.exports = actuator_router;