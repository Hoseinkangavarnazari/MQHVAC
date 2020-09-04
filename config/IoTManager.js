var logger =require("../config/logger")

const sensorStatusRouter = require("../routes/_sensorStatus.routes");
const systemLogRouter = require("../routes/_systemLog.routes");


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
exports.subscribtion= (mqttClient)=> {
    var actuatorCollection = require("../models/_Actuator.model")

    // mqttClient.subscribe("1/sensor_status", { qos: 2 });

    // there is a problem here
    actuatorCollection.find({},function(error,actuators){
        if(error){
            console.log("Error: ",error);
        }
        actuators.forEach((actuator)=>{
            topic = actuator.aid+"/+";
            mqttClient.subscribe(topic, { qos: 2 });
            console.log(topic)
        });
    });
}



exports.topicHandler = (topic, message, packet)=>{
    // TODO packet can be used in logging mechanism
    console.log("Topic: ",topic)
    logger.log('info',{
        time: new Date(),
        type: "MQTT",
        topic: topic,
        message: JSON.parse(message),
        });
    temp = topic.split("/")

    aid =temp[0]
    subTopic=temp[1]


    // avalesho ta slash bardar ke esme gateway hast ono estekhraj kon chon mikhay ke estefadash koni va pas bedi bedakhel
    // baghie ham ke dg mishe goft adie

    switch (subTopic) {
        case "sensor_status":
            return sensorStatusRouter.saveStatus(aid, message)
        case "system_log":
            return systemLogRouter.saveLog(aid,message)

    }
}