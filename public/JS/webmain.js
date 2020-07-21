function updateDATA(reqG) {

    console.log("Update setpoint request has been sent");

    $.ajax({
        url: "http://localhost:2999/webapi/updatedata",
        dataType: 'json',
        data: {
            "requestedGateway": reqG
        },
        type: "POST", // if you want to send data via the "data" property change this to "POST". This can be omitted otherwise
        success: function(responseData) {
            gatewaysStatus = responseData
            console.log(gatewaysStatus)
                // var sensors = responseData.sensors
                // console.log("RECEIVED: " + sensors[0].T);

            // $('#G1S1T').text = sensors[0].T;
            // for (var i = 0; i < sensors.length; i++) {
            //     var ELEMENT = 'G';
            //     ELEMENT += reqG;
            //     ELEMENT += 'S' + sensors[i].SID;
            //     console.log(ELEMENT);
            //     document.getElementById(ELEMENT + 'T').innerText = sensors[i].T;
            //     document.getElementById(ELEMENT + 'H').innerText = sensors[i].H;
            // };

            for (var i = 0; i < gatewaysStatus.length; i++) {
                var prefixElement = gatewaysStatus[i].GID;
                console.log(gatewaysStatus[i].avgTemperature.length)
                for (var j = 0; j < gatewaysStatus[i].avgTemperature.length; j++) {
                    let ELEMENT = prefixElement + "s" + j.toString();
                    console.log(ELEMENT)
                    document.getElementById(ELEMENT + 't').innerText = gatewaysStatus[i].avgTemperature[j];
                    document.getElementById(ELEMENT + 'h').innerText = gatewaysStatus[i].avgHumidity[j];
                }

            }

        },
        error: console.error
    });
}



function emergencyCall(reqG, command) {

    console.log("Emergency Call requested");

    $.ajax({
        url: "http://localhost:2999/webapi/emergencycall",
        dataType: 'json',
        data: {
            "GID": reqG,
            command: command
        },
        type: "POST", // if you want to send data via the "data" property change this to "POST". This can be omitted otherwise
        success: function(responseData) {
            console.log("Emergency call requested");
        },
        error: console.error
    });
}


var myVar1 = setInterval(updateDATA, 5000, 1);
// var myVar2 = setInterval(updateDATA, 5000, 2);