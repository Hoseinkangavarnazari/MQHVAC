var MQTT = require('mqtt');

function between(min, max) {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}


const HOST = "mqtt://127.0.0.1"
// const HOST = "mqtt://mqtt.eclipse.org"
const options = {
    qos: 2
};

var client = MQTT.connect(HOST, options);


var counter = 0;

client.on("connect", () => {
    console.log("connected  " + client.connected);

    // client.publish("g1f0", "test message"+counter);
    setInterval(() => {
        counter += 1;

        packet = {
            "GID": 'g1f0',
            "Time": "NULL",
            "sensors": [{
                    "SID": 0,
                    "temperature": between(10, 20),
                    "humidity": between(30, 50)
                },
                {
                    "SID": 1,
                    "temperature": between(10, 20),
                    "humidity": between(30, 50)
                },
                {
                    "SID": 2,
                    "temperature": between(10, 20),
                    "humidity": between(30, 50)
                },
                {
                    "SID": 3,
                    "temperature": between(10, 20),
                    "humidity": between(30, 50)
                },
                {
                    "SID": 4,
                    "temperature": between(10, 20),
                    "humidity": between(30, 50)
                }
            ]
        }

        client.publish('g1f0/update_status', JSON.stringify(packet));
        console.log("The counter is :" + counter)

    }, 5000);

    setInterval(() => {
        counter += 1;

        packet = {
            "GID": 'g2f0',
            "Time": "NULL",
            "sensors": [{
                    "SID": 0,
                    "temperature": between(10, 20),
                    "humidity": between(30, 50)
                },
                {
                    "SID": 1,
                    "temperature": between(10, 20),
                    "humidity": between(30, 50)
                },
                {
                    "SID": 2,
                    "temperature": between(10, 20),
                    "humidity": between(30, 50)
                },
                {
                    "SID": 3,
                    "temperature": between(10, 20),
                    "humidity": between(30, 50)
                },
                {
                    "SID": 4,
                    "temperature": between(10, 20),
                    "humidity": between(30, 50)
                }
            ]
        }
        client.publish('g2f0/update_status', JSON.stringify(packet));
        console.log("Total Sent Status :" + counter)
    }, 5000);
});

client.on("error", (err) => {
    console.log("Can't connect" + err);
    process.exit(1)
});