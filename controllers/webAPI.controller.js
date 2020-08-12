var request = require('request');
var sensorStatus = require("../models/sensorStatus.model");
var schedule = require('../models/schedule.model');
const {
    Console
} = require('console');


function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low)
}

exports.setSchedule = async (req, res) => {
    console.log("An schedule have been received. GID: ", req.body.GID)
    console.log("sunday", req.body.sunday)

    // first save it into database 
    var newSchedule = new schedule({
        GID: req.body.GID,
        SJ: "S",
        saturday: req.body.saturday,
        sunday: req.body.sunday,
        monday: req.body.monday,
        tuesday: req.body.tuesday,
        wednesday: req.body.wednesday,
        thursday: req.body.thursday,
        friday: req.body.friday,
    });

    try {
        newSchedule.save();
        // res.send("::: Saved into the database.");
        console.log(":::  Saved into the database.")

    } catch (err) {
        res.send("::: There is something wrong with saving to DB");
        // You should stop the whole process here
        console.log("::: There is something wrong with saving to DB", err)
    }


    // publish it into related topic 

    var mqtttemp = require('mqtt')
    const mqtttempBroker = "mqtt://127.0.0.1"
    // const mqttBroker = "mqtt://mqtt.eclipse.org"
    const options = {
        qos: 2
    };

    var mqtttempClient = mqtttemp.connect(mqtttempBroker, {
        clientId: "mqttjs99"
    }, options);

    mqtttempClient.publish(req.body.GID+"/schedule",JSON.stringify(req.body),options,(error)=>{
        if(error){
            console.log("there was an error: ",error);
        }else{
            console.log("Schedule published successfully");
        }
    });


    res.send({"status":"Schedule published successfully"})
    // answer to it 

}

exports.updateData = async (req, res) => {

    response = []

    GIDLIST = ['g1f0', 'g2f0']
    for (currentGID of GIDLIST) {
        sensorData = await sensorStatus.find({
            GID: currentGID
        }, function (err, document) {
            // five is number of sensors
            var avgTemperature = new Array(5);
            avgTemperature.fill(0);

            var avgHumidity = new Array(5);
            avgHumidity.fill(0);
            for (x of document) {
                tempSensors = x.sensors
                for (y of tempSensors) {
                    avgTemperature[y.SID] += y.temperature;
                    avgHumidity[y.SID] += y.humidity;
                }
            }

            for (i = 0; i < avgTemperature.length; i++) {
                avgTemperature[i] /= document.length
                avgHumidity[i] /= document.length
            }

            let tempresponse = {
                "GID": currentGID,
                "avgTemperature": avgTemperature,
                "avgHumidity": avgHumidity
            }
            response.push(tempresponse);
        }).sort({
            _id: -1
        }).limit(5);
    }

    // console.log(response)
    res.send(response)
    //return model
    // console.log("REQUEST gateway: " + req.body.requestedGateway)

    // let GID = req.body.requestedGateway;
    // let sensors = [
    //     { SID: 1, H: randomInt(10, 24), T: randomInt(1, 9) },
    //     { SID: 2, H: randomInt(10, 24), T: randomInt(1, 9) }
    // ]

    // res.send({
    //     "sensors": sensors
    // })

}



exports.emergencyCall = async (req, res) => {

    var net = require('net'),
        JsonSocket = require('json-socket');

    var port = 9000; //The same port that the server is listening on
    var host = '127.0.0.1';

    var socket = new JsonSocket(new net.Socket()); //Decorate a standard net.Socket with JsonSocket
    socket.connect(port, host);
    socket.on('connect', function () { //Don't send until we're connected
        socket.sendMessage({
            "status": 's',
            "GID": req.body.GID,
            "command": req.body.command,
            "relayStatus": [{
                "RID": 1,
                "relaySTATUS": req.body.command
            }]
        });
        socket.on('message', function (message) {
            console.log('The result is: ' + message.result);
        });
    });
}