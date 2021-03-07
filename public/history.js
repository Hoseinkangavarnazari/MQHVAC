var globalReport = {};
globalReport["1"] = Array(31).fill(0);
globalReport["2"] = Array(31).fill(0);
globalReport["3"] = Array(31).fill(0);
globalReport["4"] = Array(31).fill(0);
globalReport["5"] = Array(31).fill(0);
globalReport["6"] = Array(31).fill(0);

globalReport["6"][1] = 12;


var ctx2 = document.getElementById('history').getContext('2d');




function search() {
    let data = {
        aidList: ["1", "2", "3", "4", "5", "6"],
        y: document.getElementById('reqYear').value,
        m: document.getElementById('reqMonth').value
    }


    var request = $.ajax({
        url: "http://192.168.99.8:80/sensor_status/month_report",
        method: "POST",
        data: data,
        dataType: "json"
    });

    request.done(function(msg) {

        // contains all gateways
        allReports = msg.data;

        allReports.forEach(element => {

            console.log(element);

            //all sensors of an gateway
            asog = [];
            // element consist of all sensors of a gateway


            // console.log(element.data["1"])
            for (var i = 0; i <= 5; i++) {
                asog.push(element.data[i.toString()].temperature);
            }

            console.log(asog);

            avgTempRes = [];

            for (var i = 0; i < asog[0].length; i++) {
                // calculate the average! for each gateway acros 6 sensors
                avgTempRes.push(Math.round((asog[0][i] + asog[1][i] + asog[2][i] + asog[3][i] + asog[4][i]) / 5));
            }
            globalReport[element.aid] = avgTempRes;
        })
    });
}


function changeDiagram(aid) {

    if (window.chart !=undefined) {
        window.chart.destroy();
    }

    window.chart = new Chart(ctx2, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
            datasets: [{
                label: 'دما- سانتی گراد',
                backgroundColor: 'rgb(150, 200, 250)',
                borderColor: 'rgb(100,0, 0)',
                data: globalReport[aid]
            }]
        },
        // Configuration options go here
        options: {
            scales: {
                xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'تاریخ روز',
                            fontSize:20
                        }
                    }],
                yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'دما',
                            fontSize:20
                        }
                    }]
            },
        }
    });
    document.getElementById("legend").style.visibility = "visible";
}