var request = require("request");
var systemLog = require("../models/_SystemLog.model");
var Actuator = require("../models/_Actuator.model");
// MQTT ..........................................................

/**
 * Method: MQTT 3.1
 */
exports.saveLog = async (aid, log) => {
    console.log("aid", aid, "msg: ", log);

    try {
        // currently server time is considered
        // let time = msg.time
        // let time = new Date();
        var newLog = new systemLog({
            aid: aid,
            time: new Date(),
            level: log.level,
            description: log.description
        });

    } catch (err) {
        console.log("Something went wrong during saving new sensor data.", err)
    }

    try {
        newLog.save();
        console.log("Saved into the database.")

    } catch (err) {
        console.log("There is something wrong with saving to DB", err)
    }
}

// MQTT ..........................................................


// REST ...........................................................

/**
 * For security reasons we will use POST method instead of GET to
 * transmit the sensors data to the client.
 */


/**
 * method: POST 
 * Auth: required
 * url: /system_log/all_log
 * description: 
 * (1) returns all logs related for all actuators
 */
exports.allLog = async (req, res) => {
    actuators = await Actuator.find({});

    var logStorage = {};
    for (var i = 0; i < actuators.length; i++) {
        logStorage[actuators[i].aid] = []
    }

    doc = await systemLog.find({});
    if (doc.length >= 0) {
        for (var i = 0; i < doc.length; i++) {
            if (doc[i].aid in logStorage) {
                logStorage[doc[i].aid].push(doc[i])
            }
        }

        res.status(200).send(logStorage);
    } else {
        res.status(404).send("104");
    }
}


/**
 * method: POST 
 * Auth: required
 * url: /system_log/reterive_all_unseen
 * description: 
 * (1) return unseen logs of all actuators
 */
exports.reteriveAllUnseen = async (req, res) => {
    actuators = await Actuator.find({});

    var logStorage = {};
    for (var i = 0; i < actuators.length; i++) {
        logStorage[actuators[i].aid] = []
    }

    doc = await systemLog.find({});
    if (doc.length >= 0) {
        for (var i = 0; i < doc.length; i++) {
            if (doc[i].aid in logStorage && doc[i].seen == false) {
                logStorage[doc[i].aid].push(doc[i])
            }
        }

        res.status(200).send(logStorage);
    } else {
        res.status(404).send("104");
    }
}


/**
 * method: POST 
 * Auth: required
 * url: /system_log/reterive_unseen
 * description: 
 * (1) return unseen logs of requested aid
 */
exports.reteriveUnseen = async (req, res) => {

    let aid = req.body.aid;
    actuator = await Actuator.find({
        aid: aid
    });
    if (actuator.length == 0) {
        res.status(404).send("101");
        return;
    } else {

        var logStorage = {};
        logStorage[aid] = []

        doc = await systemLog.find({
            aid: aid
        });
        if (doc.length >= 0) {
            for (var i = 0; i < doc.length; i++) {
                if (doc[i].seen == false) {
                    logStorage[aid].push(doc[i])
                }
            }

            res.status(200).send(logStorage);
        } else {
            res.status(404).send("104");
        }
    }}



    /**
     * method: POST 
     * Auth: required
     * url: /system_log/log
     * description: 
     * (1) returns all logs related for requested aid
     */
    exports.log = async (req, res) => {
        let aid = req.body.aid;
        actuator = await Actuator.find({
            aid: aid
        });
        if (actuator.length == 0) {
            res.status(404).send("101");
            return;
        } else {

            var logStorage = {};
            logStorage[aid] = []

            doc = await systemLog.find({
                aid: aid
            });
            if (doc.length >= 0) {
                for (var i = 0; i < doc.length; i++) {
                    logStorage[aid].push(doc[i])
                }

                res.status(200).send(logStorage);
            } else {
                res.status(404).send("104");
            }
        }
    }


    /**
     * method: PUT 
     * Auth: required
     * url: /system_log/seen_status
     * description: 
     * (1) seen or unseen an specific log
     */
    exports.seenStatus = async (req, res) => {

        seenStatus = req.body.seen;
        if (typeof seenStatus != "boolean") {
            res.status(400).send("900")
            return;
        }

        requestedID = req.body._id;

        let doc = await systemLog.findByIdAndUpdate(requestedID, {
            '$set': {
                'seen': seenStatus
            }
        }, (err, doc) => {
            if (err) {
                res.status(404).send(`102`);
                return
            } else if (doc == null) {
                res.status(404).send("104");
                return
            } else {
                res.status(200).send("001")
            }
        });
    }



// REST ...........................................................