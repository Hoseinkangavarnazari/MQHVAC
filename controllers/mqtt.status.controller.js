// require the model
var sensorStatus = require("../models/sensorStatus.model")

/* Save MQTT received sensor statuses from gateways*/
var writeNewStatus = async(gid, msg) => {

    msg = JSON.parse(msg)
    console.log("Gateway" + msg.GID + "Sent an update status.");

    let GID = msg.GID;
    let time = msg.Time;
    let sensorsList = [];

    for (var i = 0; i < msg.sensors.length; i++) {
        var tempdata = {
            SID: msg.sensors[i].SID,
            temperature: msg.sensors[i].temperature,
            humidity: msg.sensors[i].humidity
        };
        sensorsList.push(tempdata);
    }

    var newStatus = new sensorStatus({
        GID: GID,
        sensors: sensorsList
    });

    try {
        newStatus.save();
        console.log(":::  Saved into the database.")

    } catch (err) {
        console.log("::: There is something wrong with saving to DB", err)
    }


}





module.exports = {
    writeNewStatus
}