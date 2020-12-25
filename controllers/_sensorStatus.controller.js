var request = require("request");
var SensorStatus = require("../models/_SensorStatus.model");
var Actuator = require("../models/_Actuator.model")
var Report = require("../models/_Report.model")
var moment = require('moment-jalaali');

// gerneral time lib for

changeTime = (time) => {

    // let fullDateStr = "month/day/year, 19:00";
    try {
        dateAndTime = time.split(", ");
        [month, day, year] = dateAndTime[0].split("/");
        [hour, min] = dateAndTime[1].split(":")
            // console.log(new Date(year, month, day, hour, min))
            // in javascript month are in range 0 to 11
        return new Date(year, month - 1, day, hour, min)
    } catch (e) {
        console.log(`Error ${e}`)
    }

}


// MQTT ..........................................................

/**
 * Method: MQTT 3.1
 */
exports.saveStatus = async(aid, msg) => {
    console.log("aid", aid, "msg: ", msg);
    try {
        // the main solution
        // time = changeTime(msg.time);

        let data = []

        let time = moment(new Date()).format("jYYYY-jMM-jDD HH:mm:ss");
        let year = moment().jYear();
        // because it counts from 0 to 11 and I have shifted it 
        let month = moment().jMonth() + 1;
        let day = moment().jDate();
        let hour = moment().hour();
        let minute = moment().minute();

        for (var i = 0; i < msg.data.length; i++) {
            //drop objects with no data
            if (msg.data[i].temperature == "" || msg.data[i].humidity == "") {
                continue;
            }
            var tempdata = {
                sid: msg.data[i].sid,
                temperature: Number(msg.data[i].temperature),
                humidity: Number(msg.data[i].humidity)
            };
            data.push(tempdata);
        }

        var newStatus = new SensorStatus({
            y: year,
            m: month,
            d: day,
            aid: aid,
            time: time,
            data: data
        });


        //  add this data into new model .......................................

        let todayReportExistance = await Report.findOne({
            aid: aid,
            y: year,
            m: month,
            d: day
        });

        if (todayReportExistance == null) {

            //first intialize the newdata Section
            let requestedActuator = await Actuator.findOne({
                    aid: aid
                })
                // check if it is not null
            sensorsList = requestedActuator.conf.sensorsList;
            let newdata = []
            for (i = 0; i < sensorsList.length; i++) {
                let temp = {};
                temp.avgTemperature = 0;
                temp.avgHumidity = 0;

                temp.temperature = Array(48).fill().map(u => ({
                    value: 0,
                    count: 0
                }));

                temp.humidity = Array(48).fill().map(u => ({
                    value: 0,
                    count: 0
                }));

                temp.sid = sensorsList[i].sid;
                newdata.push(temp);
                delete temp;
            }

            // Add new data to initialized data
            let timeIndex = Math.floor((hour * 60 + minute) / 30)
            console.log("INDEX", timeIndex)
            for (var i = 0; i < msg.data.length; i++) {
                // //drop objects with no data
                if (msg.data[i].temperature == "" || msg.data[i].humidity == "") {
                    continue;
                }
                // itu : index to update
                itu = newdata.findIndex(el => el.sid == msg.data[i].sid);

                tempValue = newdata[itu].temperature[timeIndex].value;
                tempCount = newdata[itu].temperature[timeIndex].count;
                newCount = tempCount + 1;
                newdata[itu].temperature[timeIndex].value = (tempCount * tempValue + Number(msg.data[i].temperature)) / newCount;
                newdata[itu].temperature[timeIndex].count = newCount;

                delete tempValue;
                delete tempCount;
                delete newCount;

                tempValue = newdata[itu].humidity[timeIndex].value;
                tempCount = newdata[itu].humidity[timeIndex].count;
                newCount = tempCount + 1;
                newdata[itu].humidity[timeIndex].value = (tempCount * tempValue + Number(msg.data[i].humidity)) / newCount;
                newdata[itu].humidity[timeIndex].count = newCount;

                // compute the average temperature and humidity for given sensor
                hCount = 0;
                tCount = 0;
                hSum = 0;
                tSum = 0;
                for (var j = 0; j < 48; j++) {
                    if (newdata[itu].humidity[j].count > 0) {
                        hCount += 1;
                        hSum += newdata[itu].humidity[j].value;
                    }
                    if (newdata[itu].temperature[j].count > 0) {
                        tCount += 1;
                        tSum += newdata[itu].temperature[j].value;
                    }
                }

                newdata[itu].avgHumidity = hSum / hCount;
                newdata[itu].avgTemperature = tSum / tCount;
            }

            var newReport = new Report({
                y: year,
                m: month,
                d: day,
                aid: aid,
                time: time,
                data: newdata
            })

            try {
                newReport.save();
                console.log("Saved into the database.")

            } catch (err) {
                console.log("There is something wrong with saving to DB", err)
            }

        } else {

            updatedData = todayReportExistance.data;
            // update the value
            // use today report existance to manage your updates
            let timeIndex = Math.floor((hour * 60 + minute) / 30)
            for (var i = 0; i < msg.data.length; i++) {
                // //drop objects with no data
                if (msg.data[i].temperature == "" || msg.data[i].humidity == "") {
                    continue;
                }
                // itu : index to update
                itu = updatedData.findIndex(el => el.sid == msg.data[i].sid);

                if (itu < 0) {
                    continue;
                }

                // here when itu is -1 there is problem
                tempValue = updatedData[itu].temperature[timeIndex].value;
                tempCount = updatedData[itu].temperature[timeIndex].count;
                newCount = tempCount + 1;
                updatedData[itu].temperature[timeIndex].value = (tempCount * tempValue + Number(msg.data[i].temperature)) / newCount;
                updatedData[itu].temperature[timeIndex].count = newCount;

                delete tempValue;
                delete tempCount;
                delete newCount;

                tempValue = updatedData[itu].humidity[timeIndex].value;
                tempCount = updatedData[itu].humidity[timeIndex].count;
                newCount = tempCount + 1;
                updatedData[itu].humidity[timeIndex].value = (tempCount * tempValue + Number(msg.data[i].humidity)) / newCount;
                updatedData[itu].humidity[timeIndex].count = newCount;

                // compute the average temperature and humidity for given sensor
                hCount = 0;
                tCount = 0;
                hSum = 0;
                tSum = 0;
                for (var j = 0; j < 48; j++) {
                    if (updatedData[itu].humidity[j].count > 0) {
                        // the counting is correct we grap the average 
                        hCount += 1;
                        hSum += updatedData[itu].humidity[j].value;
                    }
                    if (updatedData[itu].temperature[j].count > 0) {
                        tCount += 1;
                        tSum += updatedData[itu].temperature[j].value;
                    }
                }
                updatedData[itu].avgHumidity = hSum / hCount;
                updatedData[itu].avgTemperature = tSum / tCount;
            }
            try {
                await Report.findOneAndUpdate({
                    y: year,
                    m: month,
                    d: day,
                    aid: aid
                }, {
                    data: updatedData
                })

                console.log("Saved into the database.")
            } catch (err) {
                console.log("There is something wrong with saving to DB", err)
            }
        }
    } catch (err) {
        console.log("Something went wrong during saving new sensor data.", err)
    }
    try {
        newStatus.save();
        console.log("Saved into the database.")
    } catch (err) {
        console.log("There is something wrong with saving to DB", err)
    }
}

// MQTT ..........................................................




/**
 * For security reasons we will use POST method instead of GET to
 * transmit the sensors data to the client.
 */


// /**
//  * method: POST 
//  * Auth: required
//  * url: /sensor_status/report
//  * description: 
//  * (1) finds related sensors to requested aid
//  * (2) returns the latest sensor status for each of them
//  */
// exports.report = async (req, res) => {
//     // similar implementation as report all
//     // don't change it let them be identical

//     aid = req.body.aid

//     // use the data if they are for 30 minutes we had to get the 300 latest because of speed.
//     // For example for 6 gateways with  1 min frequency : in 30 min -> 30 * 6 = 180  
//     //  we have doubled it to make sure we can receive usefull information.
//     let data = await SensorStatus.find({
//         aid: aid
//     }).sort({
//         _id: -1
//     }).limit(10);

//     // make all gateways and correspondig sensors.
//     let actuators = await Actuator.find({
//         aid: aid
//     });

//     if (actuators.length == 0) {
//         res.status(404).send("101");
//         return;
//     }

//     let responseMessage = {}

//     for (var i = 0; i < actuators.length; i++) {
//         responseMessage[actuators[i].aid] = {};
//         for (var j = 0; j < actuators[i].conf.sensorsList.length; j++) {
//             responseMessage[actuators[i].aid][actuators[i].conf.sensorsList[j].sid] = {
//                 humidity: 0,
//                 temperature: 0,
//                 count: 0
//             }
//         }
//     }


//     // looks for a data reported at most 30 minutes before.
//     var beforeTime = moment().subtract(30 * 60, 'second');
//     var afterTime = moment();

//     data.forEach(element => {
//         var elemTime = moment(element.time);
//         if (elemTime.isBetween(beforeTime, afterTime)) {
//             console.log(`Valid range sensorTime: ${elemTime}`)
//             let tempAid = element.aid;
//             if (element.data == null) {
//                 return;
//             }

//             for (var i = 0; i < element.data.length; i++) {
//                 let tempSid = element.data[i].sid;

//                 if (typeof responseMessage[tempAid][tempSid] != "undefined") {
//                     responseMessage[tempAid][tempSid].temperature += element.data[i].temperature;
//                     responseMessage[tempAid][tempSid].humidity += element.data[i].humidity;
//                     responseMessage[tempAid][tempSid].count += 1;
//                 } else {
//                     console.log(`*** INVALID tempaid : ${tempAid} tempsid: ${tempSid}`)
//                 }
//             }
//         }
//     });
//     for (var tempActuator in responseMessage) {
//         for (var tempSensor in responseMessage[tempActuator]) {
//             if (typeof responseMessage[tempActuator][tempSensor] != "undefined") {
//                 if (responseMessage[tempActuator][tempSensor].count > 0) {
//                     responseMessage[tempActuator][tempSensor].temperature /= responseMessage[tempActuator][tempSensor].count;
//                     responseMessage[tempActuator][tempSensor].humidity /= responseMessage[tempActuator][tempSensor].count;
//                 } else {
//                     responseMessage[tempActuator][tempSensor].temperature /= NaN;
//                     responseMessage[tempActuator][tempSensor].humidity /= NaN;
//                 }
//             }
//         }
//     }

//     res.status(200).send(responseMessage);
// }


// /**
//  * method: POST 
//  * Auth: required
//  * url: /sensor_status/report_all
//  * description: 
//  * (1) returns the latest sensor status for each actuator and correspondig
//  *     sensors
//  */
// exports.reportAll = async (req, res) => {
//     console.log("You hit the endpoint");
//     // use the data if they are for 30 minutes we had to get the 300 latest because of speed.
//     // For example for 6 gateways with  1 min frequency : in 30 min -> 30 * 6 = 180  
//     //  we have doubled it to make sure we can receive usefull information.
//     let data = await SensorStatus.find().sort({
//         _id: -1
//     }).limit(360);

//     // make all gateways and correspondig sensors.
//     let actuators = await Actuator.find();
//     let responseMessage = {}

//     for (var i = 0; i < actuators.length; i++) {
//         responseMessage[actuators[i].aid] = {};
//         for (var j = 0; j < actuators[i].conf.sensorsList.length; j++) {
//             responseMessage[actuators[i].aid][actuators[i].conf.sensorsList[j].sid] = {
//                 humidity: 0,
//                 temperature: 0,
//                 count: 0
//             }
//         }
//     }


//     // looks for a data reported at most 30 minutes before.
//     var beforeTime = moment().subtract(30 * 60, 'second');
//     var afterTime = moment();

//     // add all data within the time range.
//     data.forEach(element => {
//         var elemTime = moment(element.time);
//         if (elemTime.isBetween(beforeTime, afterTime)) {
//             console.log(`Valid range sensorTime: ${elemTime}`)
//             let tempAid = element.aid;
//             if (element.data == null) {
//                 return;
//             }

//             for (var i = 0; i < element.data.length; i++) {
//                 let tempSid = element.data[i].sid;

//                 if (typeof responseMessage[tempAid][tempSid] != "undefined") {
//                     responseMessage[tempAid][tempSid].temperature += element.data[i].temperature;
//                     responseMessage[tempAid][tempSid].humidity += element.data[i].humidity;
//                     responseMessage[tempAid][tempSid].count += 1;
//                 } else {
//                     console.log(`*** INVALID tempaid : ${tempAid} tempsid: ${tempSid}`)
//                 }
//             }
//         }
//     });

//     // get average
//     for (var tempActuator in responseMessage) {
//         for (var tempSensor in responseMessage[tempActuator]) {
//             if (typeof responseMessage[tempActuator][tempSensor] != "undefined") {
//                 if (responseMessage[tempActuator][tempSensor].count > 0) {
//                     responseMessage[tempActuator][tempSensor].temperature /= responseMessage[tempActuator][tempSensor].count;
//                     responseMessage[tempActuator][tempSensor].humidity /= responseMessage[tempActuator][tempSensor].count;
//                 } else {
//                     responseMessage[tempActuator][tempSensor].temperature /= NaN;
//                     responseMessage[tempActuator][tempSensor].humidity /= NaN;
//                 }
//             }
//         }
//     }

//     res.status(200).send(responseMessage);
// }


// /**
//  * method: POST 
//  * Auth: required
//  * url: /sensor_status/today_history
//  * description: 
//  * (1) returns an array that contains data of each sensor for every 30 minutes
//  *     in a day for requested aid
//  */
exports.todayHisotry = async(req, res) => {

    let aid = req.body.aid;

    let actuators = await Actuator.find({
        aid: aid
    });
    if (actuators.length == 0) {
        res.status(404).send("Requested Actuator doesn't exists in our database.");
        return;
    }

    let responseMessage = {}
    for (var i = 0; i < actuators.length; i++) {
        responseMessage[actuators[i].aid] = {};
        for (var j = 0; j < actuators[i].conf.sensorsList.length; j++) {
            responseMessage[actuators[i].aid][actuators[i].conf.sensorsList[j].sid] = {
                // we split the day into 48 half an hour
                humidity: Array(48).fill(0),
                temperature: Array(48).fill(0),
                count: Array(48).fill(0)
            }
        }
    }

    // you need to look at all the data you have 
    // if your frequency is every 5 minutes in every hour about 12 messages from a gateway
    // each day you have about 24*12 =  288 messages
    // with this type of calculation, I consider about 1000 messages as safety margin 
    // ** In this version I considered 3000 because at the moment the round time is 5 seconds
    // TODO :  this method can be optimized
    let data = await SensorStatus.find({
        aid: aid
    }).sort({
        _id: -1
    }).limit(3000);

    var today = moment();
    data.forEach(element => {
        // First check if this is for today


        if (today.isSame(moment(element.time), 'day')) {

            tempAid = element.aid;
            time = moment(element.time)
            minutesPassedToday = time.hours() * 60 + time.minutes()
            index = getCorrectInterval(minutesPassedToday);
            // for each sids
            sensorsData = element.data;
            if (sensorsData == null) {
                return;
            }

            for (var i = 0; i < sensorsData.length; i++) {
                let tempSid = sensorsData[i].sid;

                if (typeof responseMessage[tempAid][tempSid] != "undefined") {
                    responseMessage[tempAid][tempSid].temperature[index] += sensorsData[i].temperature;
                    responseMessage[tempAid][tempSid].humidity[index] += sensorsData[i].humidity;
                    responseMessage[tempAid][tempSid].count[index] += 1;
                } else {
                    console.log(`*** INVALID tempaid : ${tempAid} tempsid: ${tempSid}`)
                }
            }

        } else {
            return;
        }
    })

    // make the average
    // get average
    for (var tempActuator in responseMessage) {
        for (var tempSensor in responseMessage[tempActuator]) {
            if (typeof responseMessage[tempActuator][tempSensor] != "undefined") {
                for (var i = 0; i < 48; i++) {
                    if (responseMessage[tempActuator][tempSensor].count[i] > 0) {
                        responseMessage[tempActuator][tempSensor].temperature[i] /= responseMessage[tempActuator][tempSensor].count[i];
                        responseMessage[tempActuator][tempSensor].humidity[i] /= responseMessage[tempActuator][tempSensor].count[i];
                        //  round the values
                        responseMessage[tempActuator][tempSensor].temperature[i] = responseMessage[tempActuator][tempSensor].temperature[i].toPrecision(4);
                        responseMessage[tempActuator][tempSensor].humidity[i] = responseMessage[tempActuator][tempSensor].humidity[i].toPrecision(4);

                    } else {
                        responseMessage[tempActuator][tempSensor].temperature[i] /= NaN;
                        responseMessage[tempActuator][tempSensor].humidity[i] /= NaN;
                    }
                }

            }
        }
    }
    res.status(200).send(responseMessage);
}


// /**
//  * method: POST 
//  * Auth: required
//  * url: /sensor_status/today_history_all
//  * description: 
//  * (1) returns an array that contains data of each sensor for every 30 minutes
//  *     in a day for all actuators
//  */
// exports.todayHisotryAll = async (req, res) => {
//     let actuators = await Actuator.find();
//     let responseMessage = {}

//     for (var i = 0; i < actuators.length; i++) {
//         responseMessage[actuators[i].aid] = {};
//         for (var j = 0; j < actuators[i].conf.sensorsList.length; j++) {
//             responseMessage[actuators[i].aid][actuators[i].conf.sensorsList[j].sid] = {
//                 // we split the day into 48 half an hour
//                 humidity: Array(48).fill(0),
//                 temperature: Array(48).fill(0),
//                 count: Array(48).fill(0)
//             }
//         }
//     }

//     // you need to look at all the data you have 
//     // if your frequency is every 5 minutes in every hour about 12 messages from each gateway
//     // each day you have about 24*12*6 = 1728 messages
//     // with this type of calculation, I consider about 1200 more messages as safety margin 
//     // i.e., totally 3000 messages
//     // I will look at latests 3000 messages in sensorStatus collection in order to provide this report]
//     // ** In this version I considered 10000 because at the moment the round time is 5 seconds
//     // TODO :  this method can be optimized
//     let data = await SensorStatus.find().sort({
//         _id: -1
//     }).limit(10000);

//     var today = moment();
//     data.forEach(element => {
//         // First check if this is for today
//         if (today.isSame(moment(element.time), 'day')) {
//             tempAid = element.aid;
//             time = moment(element.time)
//             minutesPassedToday = time.hours() * 60 + time.minutes()
//             index = getCorrectInterval(minutesPassedToday);
//             sensorsData = element.data;

//             if (sensorsData == null) {
//                 return;
//             }
//             for (var i = 0; i < sensorsData.length; i++) {
//                 let tempSid = sensorsData[i].sid;

//                 if (typeof responseMessage[tempAid][tempSid] != "undefined") {
//                     responseMessage[tempAid][tempSid].temperature[index] += sensorsData[i].temperature;
//                     responseMessage[tempAid][tempSid].humidity[index] += sensorsData[i].humidity;
//                     responseMessage[tempAid][tempSid].count[index] += 1;
//                 } else {
//                     console.log(`*** INVALID tempaid : ${tempAid} tempsid: ${tempSid}`)
//                 }
//             }

//         } else {
//             return;
//         }
//     })

//     // make the average
//     // get average
//     for (var tempActuator in responseMessage) {
//         for (var tempSensor in responseMessage[tempActuator]) {
//             if (typeof responseMessage[tempActuator][tempSensor] != "undefined") {
//                 for (var i = 0; i < 48; i++) {
//                     if (responseMessage[tempActuator][tempSensor].count[i] > 0) {
//                         responseMessage[tempActuator][tempSensor].temperature[i] /= responseMessage[tempActuator][tempSensor].count[i];
//                         responseMessage[tempActuator][tempSensor].humidity[i] /= responseMessage[tempActuator][tempSensor].count[i];
//                         //  round the values
//                         responseMessage[tempActuator][tempSensor].temperature[i] = responseMessage[tempActuator][tempSensor].temperature[i].toPrecision(4);
//                         responseMessage[tempActuator][tempSensor].humidity[i] = responseMessage[tempActuator][tempSensor].humidity[i].toPrecision(4);
//                     } else {
//                         responseMessage[tempActuator][tempSensor].temperature[i] /= NaN;
//                         responseMessage[tempActuator][tempSensor].humidity[i] /= NaN;
//                     }
//                 }

//             }
//         }
//     }
//     res.status(200).send(responseMessage);
// }


/**
 * TODO:
 * Send history for specific range in timeline
 */


// function getCorrectInterval(x) {
//     return Math.floor(x / 30);
// }

/**
 * method: POST 
 * Auth: required
 * url: /sensor_status/day_report
 * description: 
 * (1) Returns the data for requested date, returns the average of each 30 minutes in a day.
 */
exports.dayReport = async(req, res) => {
        aidList = req.body.aidList;
        y = Math.floor(req.body.y);
        m = Math.floor(req.body.m);
        d = Math.floor(req.body.d);

        if (m > 6) {
            daysInMonth = 30;
        } else {
            daysInMonth = 31
        }

        // check received data if they are resonable or not !
        if (aidList.length == 0) {
            res.status(404).send("101");
            return;
        } else {
            if (y == null || m == null) {
                res.status(400).send("900")
                return;
            }
            if (m > 12 || m <= 0 || y < 1390 || y > 1450 || d > 31 || d < 1) {
                res.status(400).send("903");
                return;
            }
        }
        actuatorLists = await Actuator.find({});

        if (actuatorLists.length == 0) {
            res.status(404).send("103");
            return;
        }

        var data = []
        for (var i = 0; i < actuatorLists.length; i++) {
            if (aidList.includes(actuatorLists[i].aid)) {
                let tempAid = {};
                tempAid.aid = actuatorLists[i].aid;
                tempAid.data = []
                for (var j = 0; j < actuatorLists[i].conf.sensorsList.length; j++) {
                    let tempSid = {};
                    tempSid.sid = actuatorLists[i].conf.sensorsList[j].sid;
                    tempSid.avgH = 0;
                    tempSid.avgT = 0;
                    // every 30 min in a day
                    tempSid.humidity = [];
                    tempSid.temperature = [];
                    tempAid.data.push(tempSid);
                    delete tempSid;
                }
                data.push(tempAid)
                delete tempAid;
            } else {
                continue;
            }
        }

        relatedReports = await Report.find({
            y: y,
            m: m,
            d: d
        });


        for (var i = 0; i < relatedReports.length; i++) {
            if (aidList.includes(relatedReports[i].aid)) {
                tempAid = relatedReports[i].aid;
                // find related aid index in data 
                indexAID = data.findIndex(el => el.aid == tempAid);
                d = relatedReports[i].d;
                for (var j = 0; j < relatedReports[i].data.length; j++) {
                    tempSid = relatedReports[i].data[j].sid;
                    tempH = relatedReports[i].data[j].avgHumidity;
                    tempT = relatedReports[i].data[j].avgTemperature;
                    // find related sid index in data[indexAID]
                    indexSID = data[indexAID].data.findIndex(el => el.sid == tempSid);
                    data[indexAID].data[indexSID].temperature = relatedReports[i].data[j].temperature;
                    data[indexAID].data[indexSID].humidity = relatedReports[i].data[j].humidity;
                    data[indexAID].data[indexSID].avgH = relatedReports[i].data[j].avgHumidity;
                    data[indexAID].data[indexSID].avgT = relatedReports[i].data[j].avgTemperature;
                }
            }
        }

        let response = {};
        response.data = data;
        response.m = m;
        response.y = y;
        response.d = d;
        res.status(200).send(response);
        // res.send("you hit day report");
    }
    /**
     * method: POST 
     * Auth: required
     * url: /sensor_status/month_report
     * description: 
     * (1) Returns the data for requested month, returns the average of the day
     */
exports.monthReport = async(req, res) => {
    // Parse Information
    aidList = req.body.aidList;
    y = Math.floor(req.body.y);
    m = Math.floor(req.body.m);
    let daysInMonth = 0;

    if (m > 6) {
        daysInMonth = 30;
    } else {
        daysInMonth = 31
    }
    // check received data if they are resonable or not !
    if (aidList.length == 0) {
        res.status(404).send("101");
        return;
    } else {
        if (y == null || m == null) {
            res.status(400).send("900")
            return;
        }
        if (m > 12 || m <= 0 || y < 1390 || y > 1450) {
            res.status(400).send("903");
            return;
        }
    }
    actuatorLists = await Actuator.find({});

    if (actuatorLists.length == 0) {
        res.status(404).send("103");
        return;
    }
    // The initialization.
    var data = []
    for (var i = 0; i < actuatorLists.length; i++) {
        if (aidList.includes(actuatorLists[i].aid)) {
            let tempAid = {};
            tempAid.aid = actuatorLists[i].aid;
            tempAid.data = []
            for (var j = 0; j < actuatorLists[i].conf.sensorsList.length; j++) {
                let tempSid = {};
                tempSid.sid = actuatorLists[i].conf.sensorsList[j].sid;
                tempSid.humidity = Array(daysInMonth).fill(0);
                tempSid.temperature = Array(daysInMonth).fill(0);
                tempAid.data.push(tempSid);
                delete tempSid;
            }
            data.push(tempAid)
            delete tempAid;
        } else {
            continue;
        }
    }
    relatedReports = await Report.find({
        y: y,
        m: m
    });

    for (var i = 0; i < relatedReports.length; i++) {
        if (aidList.includes(relatedReports[i].aid)) {
            tempAid = relatedReports[i].aid;
            // find related aid index in data 
            indexAID = data.findIndex(el => el.aid == tempAid);
            d = relatedReports[i].d;
            for (var j = 0; j < relatedReports[i].data.length; j++) {
                tempSid = relatedReports[i].data[j].sid;
                tempH = relatedReports[i].data[j].avgHumidity;
                tempT = relatedReports[i].data[j].avgTemperature;
                // find related sid index in data[indexAID]
                indexSID = data[indexAID].data.findIndex(el => el.sid == tempSid);
                data[indexAID].data[indexSID].temperature[d] = relatedReports[i].data[j].avgTemperature;
                data[indexAID].data[indexSID].humidity[d] = relatedReports[i].data[j].avgHumidity;
                // according to received d : day fill the value of humidity and temperature array here
            }
        }
    }

    let response = {};
    response.data = data;
    response.m = m;
    response.y = y;
    res.status(200).send(response);
}


/**
 * method: POST 
 * Auth: required
 * url: /sensor_status/latest_report
 * description: 
 * (1) Returns the latest period. 
 */
exports.latestReport = async(req, res) => {


    aidList = req.body.aidList;
    let y = moment().jYear();
    // because it counts from 0 to 11 and I have shifted it 
    let m = moment().jMonth() + 1;
    let d = moment().jDate();
    let hour = moment().hour();
    let minute = moment().minute();
    let timeIndex = Math.floor((hour * 60 + minute) / 30);

    actuatorLists = await Actuator.find({});

    if (actuatorLists.length == 0) {
        res.status(404).send("103");
        return;
    }

    var data = []
    for (var i = 0; i < actuatorLists.length; i++) {
        if (aidList.includes(actuatorLists[i].aid)) {
            let tempAid = {};
            tempAid.aid = actuatorLists[i].aid;
            tempAid.data = []
            for (var j = 0; j < actuatorLists[i].conf.sensorsList.length; j++) {
                let tempSid = {};
                tempSid.sid = actuatorLists[i].conf.sensorsList[j].sid;
                tempSid.H = 0;
                tempSid.T = 0;
                tempAid.data.push(tempSid);
                delete tempSid;
            }
            data.push(tempAid)
            delete tempAid;
        } else {
            continue;
        }
    }

    relatedReports = await Report.find({
        y: y,
        m: m,
        d: d
    });


    for (var i = 0; i < relatedReports.length; i++) {
        if (aidList.includes(relatedReports[i].aid)) {
            tempAid = relatedReports[i].aid;
            // find related aid index in data 
            indexAID = data.findIndex(el => el.aid == tempAid);
            d = relatedReports[i].d;
            for (var j = 0; j < relatedReports[i].data.length; j++) {
                tempSid = relatedReports[i].data[j].sid;
                // find related sid index in data[indexAID]
                indexSID = data[indexAID].data.findIndex(el => el.sid == tempSid);
                data[indexAID].data[indexSID].T = relatedReports[i].data[j].temperature[timeIndex];
                data[indexAID].data[indexSID].H = relatedReports[i].data[j].humidity[timeIndex];
            }
        }
    }

    let response = {};
    response.data = data;
    response.m = m;
    response.y = y;
    response.d = d;
    response.h = hour;
    res.status(200).send(response);
}