// Require express and create an instance of it
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
const server = require("http").Server(app);
// const mqttRouter = require("./routes/mqtt.routes");
var logger = require("./config/logger");


app.use(cookieParser());

//------------------MQTT Handlers-------------------
var mqtt = require("mqtt");
const mqttBroker = "mqtt://127.0.0.1";
// const mqttBroker = "mqtt://mqtt.eclipse.org"
const options = {
    qos: 2,
};

var mqttClient = mqtt.connect(mqttBroker, {
    clientId: "mqttjs99"
}, options);


// gateway initialization
// var conf = require("./config/topicMananger");
// conf.checkGatewayInitialization();
// conf.subscribtion(mqttClient);


// Actuator initialization ................................
const IoTConfiguration = require("./config/IoTManager")
 IoTConfiguration.initialization();
 IoTConfiguration.subscribtion(mqttClient);


mqttClient.on("connect", () => {/* console.log("connected  " + mqttClient.connected);*/});
mqttClient.on("error", (err) => {
    console.log("Can't connect" + err);
    process.exit(1);
});

mqttClient.on("message", (topic, message, packet) => {
    // conf.topicHandler(topic, message, packet);
    IoTConfiguration.topicHandler(topic, message, packet);
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static("public"));

// Request logging middleware
app.use((req, res, next) => {
    // log here
    logger.log('info',{
        type: "HTTP",
        url: req.url,
        method: req.method,
        ip: req.ip,
        cookie: req.cookies,
        msgBody: req.body
        })
    next();
})


// // status receiver ----------------------------------------
// var webAPIRouter = require("./routes/webAPI.routes");
// app.use("/webapi", webAPIRouter);
// // --------------------------------------------------------

// systemlog router ----------------------------------------
const systemLogModule = require("./routes/_systemLog.routes");
// since two modules are exported from systemLog.routes we need to refer 
// specifically to the router
app.use("/system_log", systemLogModule.systemLog_router);
// --------------------------------------------------------

// sensor status router ----------------------------------------
// since two modules are exported from sensorStatus.routes we need to refer 
// specifically to the router
const sensorStatusModule = require("./routes/_sensorStatus.routes");
app.use("/sensor_status", sensorStatusModule.sensorStatus_router);
// --------------------------------------------------------

// Actuator router ----------------------------------------
const actuatorModule = require("./routes/_actuator.routes");
app.use("/actuator", actuatorModule);
// --------------------------------------------------------

// user router --------------------------------------------
const userRouter = require("./routes/user.routes")
app.use('/user', userRouter);
// --------------------------------------------------------


//SEVER
const PORT = 2999;
app.listen(PORT, function () {
    console.log("Server application is listening port " + PORT + ".");
});