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


function addTime(day){
    console.log("Add time from day:",day);

    var element = document.getElementById(day);
    console.log(element)

    var context= document.createElement("div");
    context.setAttribute("class","input-group");
    context.setAttribute("style","margin-bottom:10px;")


    var childTitle= document.createElement("div");
    childTitle.setAttribute("class","input-group-prepend");


    var childChildSpan = document.createElement('span');
    childChildSpan.setAttribute("class","input-group-text");
    childChildSpan.textContent="Start & End";


    childTitle.appendChild(childChildSpan);
    context.appendChild(childTitle);

    var timeStart= document.createElement("input");
    timeStart.setAttribute("type","time");
    timeStart.setAttribute("id","appt");
    timeStart.setAttribute("name","appt");
    timeStart.setAttribute("min","00:00");
    timeStart.setAttribute("max","23:59");
    timeStart.setAttribute("style","margin-right:5px;");

    var timeEnd = document.createElement("input");
    timeEnd.setAttribute("type","time");
    timeEnd.setAttribute("id","appt");
    timeEnd.setAttribute("name","appt");
    timeEnd.setAttribute("min","00:00");
    timeEnd.setAttribute("max","23:59");

    console.log(timeStart)
    context.appendChild(timeStart);
    context.appendChild(timeEnd);
    element.appendChild(context);
}


var myVar1 = setInterval(updateDATA, 5000, 1);
// var myVar2 = setInterval(updateDATA, 5000, 2);


