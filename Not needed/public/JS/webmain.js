function updateDATA(reqG) {

    console.log("Update setpoint request has been sent");

    $.ajax({
        url: "http://localhost:2999/webapi/updatedata",
        dataType: 'json',
        data: {
            "requestedGateway": reqG
        },
        type: "POST", // if you want to send data via the "data" property change this to "POST". This can be omitted otherwise
        success: function (responseData) {
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

    console.log("An emergency call has been requested from",reqG);

    $.ajax({
        url: "http://localhost:2999/webapi/emergencycall",
        dataType: 'json',
        data: {
            "GID": reqG,
            "SJ": "M",
            "command": command
        },
        type: "POST", 
        success: function (responseData) {
            console.log("For gateway: ",reqG);
            console.log("Requested emergency call status:",responseData.status);
        },
        error: console.error
    });
}


function addTime(day) {
    console.log("Add time from day:", day);

    var element = document.getElementById(day);
    console.log(element)

    var context = document.createElement("div");
    context.setAttribute("class", "input-group");
    context.setAttribute("style", "margin-bottom:10px;")


    var childTitle = document.createElement("div");
    childTitle.setAttribute("class", "input-group-prepend");


    var childChildSpan = document.createElement('span');
    childChildSpan.setAttribute("class", "input-group-text");
    childChildSpan.textContent = "Start & End";


    childTitle.appendChild(childChildSpan);
    context.appendChild(childTitle);

    var timeStart = document.createElement("input");
    timeStart.setAttribute("type", "time");
    timeStart.setAttribute("id", "appt");
    timeStart.setAttribute("name", "appt");
    timeStart.setAttribute("min", "00:00");
    timeStart.setAttribute("max", "23:59");
    timeStart.setAttribute("style", "margin-right:5px;");

    var timeEnd = document.createElement("input");
    timeEnd.setAttribute("type", "time");
    timeEnd.setAttribute("id", "appt");
    timeEnd.setAttribute("name", "appt");
    timeEnd.setAttribute("min", "00:00");
    timeEnd.setAttribute("max", "23:59");

    console.log(timeStart)
    context.appendChild(timeStart);
    context.appendChild(timeEnd);
    element.appendChild(context);
}



function setSchedule(reqG) {

    week = ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday"]
    var schedule = {};
    const postFixAddress = " .input-group input"

    for (day in week) {
        selectorStr = '#' + week[day] + postFixAddress
        time = document.querySelectorAll(selectorStr)
        tempSchedule = []
        for (i = 0; i < time.length; i++) {
            startTime = ""
            endTime = ""

            startTime = time[i].value
            i++;
            endTime = time[i].value

            if (startTime != "" & endTime != "") {
                console.log("Starts at ", startTime, "Ends at", endTime)
                tempInner = []
                tempInner.push(startTime)
                tempInner.push(endTime)
                tempSchedule.push(tempInner)
            }
            else{
                tempSchedule.push(["00:00","00:00"])
            }
        }
        schedule[week[day]] = tempSchedule
    }

    $.ajax({
        url: "http://localhost:2999/webapi/setschedule",
        dataType: 'json',
        data: {
            "GID": reqG,
            "SJ": "S&C",
            "sunday": schedule["sunday"],
            "monday": schedule["monday"],
            "tuesday": schedule["tuesday"],
            "thursday": schedule["thursday"],
            "wednesday": schedule["wednesday"],
            "friday": schedule["friday"],
            "saturday": schedule["saturday"]
        },
        type: "POST", // if you want to send data via the "data" property change this to "POST". This can be omitted otherwise
        success: function (responseData) {
            console.log("Status of published schedule:",responseData.status);
        },
        error: console.error
    });
}

function refereshLogs(reqG){ 
    $.ajax({
        url: "http://localhost:2999/webapi/readlogs",
        dataType: 'json',
        data: {
            "GID": reqG
        },
        type: "POST", // if you want to send data via the "data" property change this to "POST". This can be omitted otherwise
        success: function (responseData) {
            console.log(responseData[0].GID);
            CurrentElement = document.getElementById(responseData[0].GID + "-logs")
            CurrentElement.innerHTML='';
            LOGeLEMENTS = []

            for (i in responseData){
                templog = responseData[i]

                // define the borders color
                levelClass=""
                switch (templog.level) {
                    case "success":
                        level="alertSuccess"
                        break;
                    case "warning":
                        level="alertWarning"
                        break;
                    case "danger":
                        level="alertDanger"
                        break;      
                }

                var context = document.createElement("div");
                context.setAttribute("class", level);
                var time = document.createElement("time")
                time.innerHTML = "<b>Log time: </b> " + templog.time +"</br>"
                var samp = document.createElement("samp");
                samp.innerHTML= "<b>Log: </b> " + templog.detail

                context.appendChild(time);
                context.appendChild(samp);
                CurrentElement.appendChild(context)
          
            }
            // call another function or do it here and update the results of logs here
        },
        error: console.error
    });
}

// var myVar1 = setInterval(updateDATA, 5000, 1);
// var myVar2 = setInterval(updateDATA, 5000, 2);


// it should be done for all gateways
window.onload = refereshLogs("G0L1F0")