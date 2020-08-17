// const gateways = require("./gateways")
// first check the database and see if the gateways are entered or we should add it from config file 


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
                if (collectionNames[i].name == 'gatewayConf') {
                    existenceFlag = true;
                    break;
                }
            }

            if (existenceFlag == true) {
                console.log("The gateway configurations are exits.");
            } else {

                console.log("Initialization : Configuring gateways.");
                initGateway();
            }
            conn.close();
        });
    });
};


function initGateway() {
    // load gateways json file
    const data = require('./gateways.json');
    var gateway = require("../models/gateway.model")


    // for all members of data you should add a model
    for (var i = 0; i < data.length; i++) {

        var gateway = new gateway({
            gid: data[i].gid,
            location: data[i].location,
            relay: data[i].realy,
            control: data[i].control,
            scheduleFlag: data[i].scheduleFlag,
            thermostatFlag: data[i].scheduleFlag,
            sensor: data[i].sensor,
            mapURL: data[i].mapURL
        });

        try {
            gateway.save();
        } catch (err) {
            console.log("::: There is something wrong in adding configuration file into database : ", err)
        }
    }
}



//  Write a subscriber function to all gateways