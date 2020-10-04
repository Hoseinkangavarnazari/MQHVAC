var logger = require("../config/logger")

const sensorStatusRouter = require("../routes/_sensorStatus.routes");
const systemLogRouter = require("../routes/_systemLog.routes");

var mqtt = require("mqtt");

//secure connection
// const fs = require('fs');
// var caFile = fs.readFileSync("Cert/ca.crt");
// const mqttBroker = "mqtts://localhost:8883";
// const options = {
//     qos: 2,
//     // port: 8883
//     rejectUnauthorized : false,
//     tls: true,
//     ca: caFile,
//     clientId: "mqttjs99"
// };

// const mqttBroker = "mqtt://mqtt.eclipse.org"

const mqttBroker = "mqtt://localhost:1883";

const options = {
    qos: 2,
};



var mqttClient = mqtt.connect(mqttBroker, {clientId: "ESP8266Client-"}, options);

mqttClient.on("connect", () => {
    /* console.log("connected  " + mqttClient.connected);*/ });
mqttClient.on("error", (err) => {
    console.log("Can't connect" + err);
    process.exit(1);
});

mqttClient.on("message", (topic, message, packet) => {
    // conf.topicHandler(topic, message, packet);
    topicHandler(topic, message, packet);
});

/**
 * Initialization of gateways for the first time
 */
exports.initialization = () => {
    const mongoose = require('mongoose');
    const mongoURI = "mongodb://localhost:27017/hvacTest";
    const conn = mongoose.createConnection(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });


    conn.on('open', function () {
        conn.db.listCollections().toArray(function (err, collectionNames) {

            if (err) {
                console.log("There was an error in opening the database in initialization step:", err);
                return;
            }
            existenceFlag = false;
            for (i in collectionNames) {
                if (collectionNames[i].name == 'actuators') {
                    existenceFlag = true;
                    break;
                }
            }

            if (existenceFlag == true) {
                console.log("Actuators has been already created.");
                conn.close();
            } else {

                console.log("Initialization : Configuring the Actuators...");
                conn.close();
                return initActuator();
            }

        });
    });
};

/**
 * Reads from actuators.json and insert the data into the database
 */
function initActuator() {
    // load gateways json file
    const data = require('./actuators.json');
    var Actuator = require("../models/_Actuator.model")


    // for all members of data you should add a model
    for (var i = 0; i < data.length; i++) {

        var newActuator = new Actuator({
            aid: data[i].aid,
            location: data[i].location,
            conf: data[i].conf,
            mapURL: data[i].mapURL
        });

        try {
            newActuator.save();
        } catch (err) {
            console.log("::: There is something wrong in adding configuration file into database : ", err);
            // system log error level
        }
    }
}


/**
 * 
 * Description: Subscribes all necessary actuators due to the actuators collection
 *              in the database.
 */
exports.subscribtion = () => {
    var actuatorCollection = require("../models/_Actuator.model")

    // mqttClient.subscribe("1/sensor_status", { qos: 2 });

    // there is a problem here
    actuatorCollection.find({}, function (error, actuators) {
        if (error) {
            console.log("Error: ", error);
        }
        actuators.forEach((actuator) => {
            topic = actuator.aid + "/+";
            mqttClient.subscribe(topic, {
                qos: 2
            });
            console.log(topic)
        });
    });
}



topicHandler = (topic, message, packet) => {
    // TODO packet can be used in logging mechanism
    console.log("Topic: ", topic)

    try {
        message = JSON.parse(message)
    } catch (error) {
        console.error("Problem with parsing body of message.", message);
        // system log should be replaced
        return;
    }
    logger.log('info', {
        time: new Date(),
        type: "MQTT",
        topic: topic,
        message: message,
    });
    temp = topic.split("/")

    aid = temp[0]
    subTopic = temp[1]


    // avalesho ta slash bardar ke esme gateway hast ono estekhraj kon chon mikhay ke estefadash koni va pas bedi bedakhel
    // baghie ham ke dg mishe goft adie

    switch (subTopic) {
        case "sensor_status":
            return sensorStatusRouter.saveStatus(aid, message)
        case "system_log":
            return systemLogRouter.saveLog(aid, message)

    }
}

exports.MQTT_send = (topic, msg) => {
    // var mqtttemp = require("mqtt");
    // const mqtttempBroker = "mqtt://127.0.0.1";
    // const options = {
    //     qos: 2,
    // };
    try {
        // var mqtttempClient = mqtttemp.connect(
        //     mqtttempBroker, {
        //         clientId: "mqttjs99",
        //     },
        //     options
        // );

        mqttClient.publish(
            topic,
            JSON.stringify(msg),
            options,
            (error) => {
                if (error) {
                    console.log("An error has been occured:  ", error);
                } else {
                    console.log("Successfully published.");
                }
            }
        );
    } catch (error) {
        if (error) {
            console.log(`Error: ${err}`)
        }
    }

}

exports.MQTT_multiple_send = (topics, msg) => {

    // var mqtttemp = require("mqtt");
    // const mqtttempBroker = "mqtt://127.0.0.1";
    // const options = {
    //     qos: 2,
    // };

    // var mqtttempClient = mqtttemp.connect(
    //     mqtttempBroker, {
    //         clientId: "mqttjs99",
    //     },
    //     options
    // );

    try {
        for (i = 0; i < topics.length; i++) {
            mqttClient.publish(
                topics[i],
                JSON.stringify(msg),
                options,
                (error) => {
                    if (error) {
                        console.log("An error has been occured:  ", error);
                    } else {
                        console.log("Successfully published.");
                    }
                }
            );
        }

    } catch (error) {
        if (error) {
            console.log(`Error: ${err}`)
        }
    }
    // mqtttempClient.end();
}