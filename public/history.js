var ctx2 = document.getElementById('history').getContext('2d');
var chart = new Chart(ctx2, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
        datasets: [{
            label: 'دما- سانتی گراد',
            backgroundColor: 'rgb(150, 200, 250)',
            borderColor: 'rgb(100,0, 0)',
            data: [0, 10, 5, 2, 20, 30, 45]
        }]
    },

    // Configuration options go here
    options: {}
});