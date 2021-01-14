var ctx = document.getElementById('pcmonthly').getContext('2d');

var globalReport = {};
globalReport["1"] = Array(31).fill(0);
globalReport["2"] = Array(31).fill(0);
globalReport["3"] = Array(31).fill(0);
globalReport["4"] = Array(31).fill(0);
globalReport["5"] = Array(31).fill(0);
globalReport["6"] = Array(31).fill(0);


function search() {
    let data = {
        aidList: ["1", "2", "3", "4", "5", "6"],
        y: document.getElementById('reqYear').value,
        m: document.getElementById('reqMonth').value
    }


    var request = $.ajax({
        url: "http://localhost:2999/sensor_status/month_report",
        method: "POST",
        data: data,
        dataType: "json"
    });

    // request.done(function(msg) {

    //     // contains all gateways
    //     allReports = msg.data;

    //     allReports.forEach(element => {

    //         console.log(element);

    //         //all sensors of an gateway
    //         asog = [];
    //         // element consist of all sensors of a gateway


    //         // console.log(element.data["1"])
    //         for (var i = 0; i <= 5; i++) {
    //             asog.push(element.data[i.toString()].temperature);
    //         }

    //         // console.log(asog);

    //         avgTempRes = [];

    //         for (var i = 0; i < asog[0].length; i++) {
    //             // calculate the average! for each gateway acros 6 sensors
    //             avgTempRes.push((asog[0][i] + asog[1][i] + asog[2][i] + asog[3][i] + asog[4][i] + asog[5][i]) / 6)
    //         }
    //         globalReport[element.aid] = avgTempRes;
    //     })
    // });
}



function changeReport(aid) {
    console.log("Change report received from aid:", aid);
}