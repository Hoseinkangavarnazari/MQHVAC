var Actuator = require("../models/_Actuator.model");
const IoTManager = require("./../config/IoTManager");



// Checks if the requested actuator is available.
checkAidValid = async (reqAid) => {
    exsitenceFlag = await Actuator.find({
        "aid": reqAid
    });
    return (exsitenceFlag.length == 0) ? false : true
}

/**
 * method: PUT 
 * Auth: required
 * url: /actuator/edit_location
 * description: 
 * (1) changes the location of requested aid
 * (2) edit location of sid 
 */
exports.editLocation = async (req, res) => {
    console.log("You hit the endpoint");
    // console.log(req.body)
    if (req.body.hasOwnProperty("sensor")) {
        // az roye sid mishe aid ro daravord pas aval ono select bayad bokone va edame majara ro sid morede nazar
        const sid = req.body.sensor.sid;
        let aid = sid.split("s")[0];
        aid = aid.substring(1, aid.length)
        const location = req.body.sensor.location;

        if (!aid || !sid || !location) {
            res.status(400).send("The body of message is not standard.")
        }

        // find it and update

        let doc = await Actuator.findOneAndUpdate({
            aid: aid,
            "conf.sensorList.sid": sid
        }, {
            $set: {
                "conf.sensorList.$.location": location,
            }
        }, {
            returnOriginal: false
        });


        res.status(501).send("Not implemented yet.");

    } else if (req.body.hasOwnProperty("actuator")) {
        const aid = req.body.actuator.aid;
        const location = req.body.actuator.location;

        if (!location || !aid) {
            res.status(406).send("The location or actuator field can not be empty");
        }

        let doc = await Actuator.findOneAndUpdate({
            aid: aid
        }, {
            location: location
        }, {
            returnOriginal: false
        });

        if (doc == null) {
            res.status(404).send("Requested actuator not found.");
        } else {
            if (doc.location == location) {
                res.status(200).send("The location successfully updated.");
            } else {
                // where it can find the requested actuator but couldn't change the value of it.
                res.status(400).send("Something went worng. Contact with administrator.")
            }
        }

    } else {
        res.status(400).send("Body of message is not properly defined.");
    }
}


/**
 * method: PUT
 * Auth: required
 * url: /actuator/control_conf
 * description: 
 * (1) changes the control configuration of requested actuator in db
 * (2) publishes into MQTT topic:  /aid/control_conf
 */
exports.controlConf = async (req, res) => {

    const aid = req.body.aid;
    const controlMode = req.body.controlMode;

    // check kon bebin jozve valid ha hast asan
    var possibleModes = ['on', 'off', 'thermostat', 'schedule', 'schedule&thermostat'];
    if (!possibleModes.find((str) => str === controlMode)) {
        res.status(400).send("Invalid control mode")
        return
    }

    if (!aid || !controlMode) {
        res.status(400).send("The body of message is not standard.")
    }

    let doc = await Actuator.findOne({
        aid: aid
    })

    if (controlMode == "schedule" || controlMode == "schedule&thermostat") {
        // check if there is an schedule for that
        let flag = false;
        schedule = doc.conf.schedule;
        days = Object.keys(schedule)
        days.forEach(element => {
            if (schedule[element].length > 0) {
                flag = true
            }
        });
        if (!flag) {
            res.status(406).send("There is no schedule available for requested actuator.")
            return;
        }
    }

    doc = await Actuator.updateOne({
        aid: aid
    }, {
        $set: {
            'conf.controlMode': controlMode
        }
    }, (err, doc) => {
        if (err) {
            res.status(400).send(`An error occured in the database111. Error: ${err}`)
        } else {
            res.status(200).send('The control mode of requested actuator has been updated.')
        }
    })

    // publish MQTT
    topic = aid + "/control_conf";
    msg = {
        "control_mode": controlMode
    }
    IoTManager.MQTT_send(topic, msg)

}


/**
 * method: PUT
 * Auth: required
 * url: /actuator/set_thermostat
 * description:
 * (1) changes the defined range for thermostat (min & max) for requested aid
 * (2) publishes into MQTT topic: /aid/set_thermostat
 */
exports.setThermostat = async (req, res) => {
    console.log("You hit the endpoint");
    let aid = req.body.aid;
    let max = req.body.max;
    let min = req.body.min;

    // type of max and min must be number otherwise system will stop :critical issue 

    if (!(aid && max && min)) {
        res.status(400).send("The body of message is not standard.")
        return
    } else {
        if (!(max > min && min > 0 && max > 0)) {
            res.status(400).send("Parameters are not reasonable. Check them again.")
        }
    }
    // 

    // find and update
    Actuator.findOneAndUpdate({
        aid: aid
    }, {
        $set: {
            'conf.thermostat.min': min,
            'conf.thermostat.max': max
        }
    }, (err, doc) => {
        if (err) {
            res.status(304).send("Couldn't save into the database.")
            return
        }
    })
    res.status(200).send("Temp response");
    // in case of successful update published thermostat for actuator with mqtt
    let topic = aid + "/set_thermostat";
    let msg = {
        thermostat: {
            max: max,
            min: min
        }
    }
    IoTManager.MQTT_send(topic, msg)

}


/**
 * method:PUT
 * Auth: required
 * url: /actuator/set_schedule
 * description:
 * (1) updates or sets schedule for requested aid 
 * (2) publishes new schedule into MQTT topic:  /aid/set_schedule
 */
exports.setSchedule = async (req, res) => {
    week = req.body;
    aid = req.body.aid;

    if (!await checkAidValid(aid)) {
        res.status(404).send("The requeseted aid is not db.");
        return;
    }

    alldays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    var timePattern = new RegExp("([01][0-9]|2[0-3]):[0-5][0-9]");
    // we have to check that there is no confilct in the sent schedule
    // by the admin
    var flag_pattern = true
    var flag_correctness = true
    alldays.forEach(day => {
        if (week[day] != null) {

            // first we need to sort them
            tempList = week[day];
            for (i = 0; i < tempList.length; i++) {
                start = tempList[i].start
                end = tempList[i].end
                if (!(timePattern.test(start) && timePattern.test(end))) {
                    // there is something wrong and the whole schedule will be deleted
                    console.log(`start: ${start} and end: ${end}`)
                    flag_pattern = false;
                    return;
                }
            }
            tempList.sort((a, b) => (a.start > b.start) ? 1 : -1);

            // after sort we can check that if the schedule is reasonable
            preEnd = "00:00"
            for (i = 0; i < tempList.length; i++) {
                start = tempList[i].start
                end = tempList[i].end
                if (!(end > start && start >= preEnd) || start == end) {
                    // there is something wrong and the whole schedule will be deleted
                    flag_correctness = false;
                    return;
                }
                preEnd = end;
            }
            console.log(tempList)
        }
    })

    if (!flag_pattern) {
        res.status(400).send("Time patterns are not correct. Both start and end must match with our regex.");
        return
    } else if (!flag_correctness) {
        res.status(400).send("There is a conflict in the schedule. Please check your schedule again.");
        return
    }

    delete week.aid;
    // save in database
    Actuator.findOneAndUpdate({
        aid: aid
    }, {
        $set: {
            'conf.schedule': week
        }
    }, (err, doc) => {
        if (err) {
            res.status(304).send("Couldn't save into the database.")
            return
        }
    })

    // Publish in MQTT 
    topic = aid + "/set_schedule";
    IoTManager.MQTT_send(topic, week)

    res.status(200).send("Successfully saved into database and pubished.");
}



/**
 * method: GET
 * Auth: required
 * url: /actuator/spec
 * description: Returns the actuator object
 */
exports.getSpec = async (req, res) => {

    let aid = req.body.aid;
    let doc = await Actuator.findOne({
        aid: aid
    });

    if (!doc) {
        res.status(404).json({
            "err": "couldn't find requested actuator in the database."
        })
    }

    let conf = doc.conf;
    let location = doc.location;

    // console.log(`conf: ${conf}, location : ${location}`)
    res.status(200).json({
        "conf": conf,
        "location": location
    });
}



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
exports.removeSchedule = async (req, res) => {

    let aid = req.body.aid;
    let schedule = {};
    let doc = await Actuator.findOneAndUpdate({
        aid: aid
    }, {
        $set: {
            'conf.schedule': schedule
        }
    }, (err, doc) => {

        if (err) {
            res.status(404).send("Something went worng with database. Contact with administrator.");
        } else if (!doc) {
            res.status(404).send("Requested actuator not found.");
        } else {
                topic = aid + "/set_schedule"
                IoTManager.MQTT_send(topic, schedule)

                if(doc.conf.controlMode == 'schedule' || doc.conf.controlMode == 'schedule&thermostat'){

                    // we have to change update the control mode in database so ...
                    // there is a problem that I couldn't handle here.
                    // write and aysnc function
                    controlMode = "thermostat";
                    // change control in database
                    // await Actuator.findOneAndUpdate({aid:aid},{
                    //     "$set":{
                    //         'conf.controlMode':controlMode
                    //     }
                    // },(err)=>{

                    // }
                    // );

                    res.status(200).send("The schedule successfully updated and control mode has been changed to thermostat.");
                }else{

                    res.status(200).send("The schedule successfully updated.");
                }
        }
    });
}

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
exports.removeAllSchedule = async (req, res) => {
    console.log("You hit the endpoint");
    res.status(200).send("Temp response");

}