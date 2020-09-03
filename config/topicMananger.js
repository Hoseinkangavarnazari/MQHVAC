
var mqttRouter = require("../routes/mqtt.routes")
// first check the database and see if the gateways are entered or we should add it from config file 

var logger =require("../config/logger")


/**
 * Initialization of gateways for the first time
 */
exports.checkGatewayInitialization = () => {
    console.log("here initial")
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
                if (collectionNames[i].name == 'gateways') {
                    existenceFlag = true;
                    break;
                }
            }

            if (existenceFlag == true) {
                console.log("The gateway configurations are exits.");
                conn.close();
            } else {

                console.log("Initialization : Configuring gateways.");
                conn.close();
                return initGateway();
            }

        });
    });
};


function initGateway() {
    // load gateways json file
    const data = require('./gateways.json');
    var gateway = require("../models/gateway.model")

    // for all members of data you should add a model
    for (var i = 0; i < data.length; i++) {

        var newGateway = new gateway({
            gid: data[i].gid,
            location: data[i].location,
            relay: data[i].relay,
            control: data[i].control,
            scheduleFlag: data[i].scheduleFlag,
            thermostatFlag: data[i].thermostatFlag,
            sensor: data[i].sensor,
            mapURL: data[i].mapURL
        });

        try {
            newGateway.save();
        } catch (err) {
            console.log("::: There is something wrong in adding configuration file into database : ", err)
        }
    }
}

//  Write a subscriber function to all gateways
exports.subscribtion= (mqttClient)=> {
    // for each gateway in gateways collection ( for each gid )
    // subscribe the "g"+gateway.gid+"/+"
 
mqttClient.subscribe("g1f0/+", { qos: 2 });
mqttClient.subscribe("g2f0/+", { qos: 2 });
mqttClient.subscribe("G0L1F0/+", { qos: 2 });
mqttClient.subscribe("G0R1F0/+", { qos: 2 });


var gateway = require("../models/gateway.model")
gateway.find({},function(error,gateways){

    gateways.forEach((g)=>{
        topic = "g"+g.gid+"/+";
        mqttClient.subscribe(topic, { qos: 2 });
        console.log(topic)
    });

});
}

 
exports.topicHandler = (topic, message, packet)=>{
    console.log("Topic: ",topic)


    logger.log('info',{
        type: "MQTT",
        topic: topic,
        message: message,
        });

    temp = topic.split("/")

    gid =temp[0]
    subTopic=temp[1]


    // avalesho ta slash bardar ke esme gateway hast ono estekhraj kon chon mikhay ke estefadash koni va pas bedi bedakhel
    // baghie ham ke dg mishe goft adie

    switch (subTopic) {
        case "update_status":
            return mqttRouter.writeNewStatus(gid, message)
        case "logs":
            return mqttRouter.writeNewLog(gid,message)

    }
}