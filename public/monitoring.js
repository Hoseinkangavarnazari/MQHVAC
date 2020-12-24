    // we need only to change the dataset
    var ctx = document.getElementById('realtime').getContext('2d');


    // var char2t = new Chart(ctx, {
    //     // The type of chart we want to create
    //     type: 'line',

    //     // The data for our dataset
    //     data: {
    //         labels: ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
    //             '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
    //         ],
    //         datasets: [{
    //             label: 'دما- سانتی گراد',
    //             backgroundColor: 'rgb(255, 99, 132)',
    //             borderColor: 'rgb(255, 99, 132)',
    //             data: [0, 10, 5, 2, 20, 30, 45]
    //         }]
    //     },

    //     // Configuration options go here
    //     options: {}
    // });

    function requestReport(aid, title) {

        // replace the title of information accoridng to selected aid

        console.log(title);

        aidList = [];
        aidList.push(aid);
        document.getElementById("titleOfMonitor").innerHTML = title;

        // wait until you receive the data
        var request = $.ajax({
            url: "http://localhost:2999/sensor_status/latest_report",
            method: "POST",
            data: { aidList: aidList },
            dataType: "json"
        });

        let receivedReport;
        request.done(function(msg) {

            receivedReport = msg.data[0].data;
            // console.log(receivedReport);

            receivedReport.forEach(element => {

                // console.log(element)
                tempID = element.sid[3]
                document.getElementById("t" + tempID).innerHTML = element.T;
                document.getElementById("h" + tempID).innerHTML = element.H + "%";
            });

        });
        request.fail(function() {
            console.log("FAILED to receive data!");
        });

        // place data here
        information = [0, 0, 0, 0, 3, 2, 3, 4, 5, 6, 12, 3, 1, 3, 3, 1, 12, 12, 3];

        var chart3 = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels: ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
                    '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
                ],
                datasets: [{
                    label: 'دما- سانتی گراد',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: information
                }]
            },

            // Configuration options go here
            options: {}
        });


    }