// Require express and create an instance of it
var express = require('express');
var bodyParser = require('body-parser');
const path = require('path');
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mqttRouter = require("./routes/mqtt.routes")



//------------------MQTT Handlers-------------------
var mqtt = require('mqtt')
const mqttBroker = "mqtt://127.0.0.1"
// const mqttBroker = "mqtt://mqtt.eclipse.org"
const options = {
    qos: 2
};

var mqttClient = mqtt.connect(mqttBroker, { clientId: "mqttjs99" }, options);

mqttClient.subscribe("g1f0/+", { qos: 2 });
mqttClient.subscribe("g2f0/+", { qos: 2 });



mqttClient.on("connect", () => {
    console.log("connected  " + mqttClient.connected);
});

mqttClient.on("error", (err) => {
    console.log("Can't connect" + err);
    process.exit(1)
});

mqttClient.on('message', (topic, message, packet) => {
    switch (topic) {
        case "g1f0/update_status":
            return mqttRouter.writeNewStatus("g1f0", message)
        case "g2f0/update_status":
            return mqttRouter.writeNewStatus("g2f0", message)
    }
});

//....................................................


const PORT = 2999;

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'))

//  serve dashboard page ---------------------------------
const serverRouter = express.Router();
serverRouter.get('/', (req, res) => {
    console.log("received a request for index page");
    res.sendFile(path.join(__dirname + '/test.html'));
})

serverRouter.get('/setting' , (req,res)=>{
    console.log("received a request for scheduling page")
    res.sendFile(path.join(__dirname + '/setting.html'));
})
app.use('/page', serverRouter);

// --------------------------------------------------------


// status receiver ----------------------------------------
var gatewayRouter = require('./routes/node.routes');
app.use('/status', gatewayRouter);
// --------------------------------------------------------



// status receiver ----------------------------------------
var webAPIRouter = require('./routes/webAPI.routes');
app.use('/webapi', webAPIRouter);
// --------------------------------------------------------




// On localhost:3000/welcome
app.post('/temperature', function(req, res) {
    console.log(req.body);
    res.send('test');
});




// start the server in the port 3000 !
app.listen(PORT, function() {
    console.log('Server application is listening port ' + PORT + ".");
});