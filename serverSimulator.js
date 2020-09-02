// Require express and create an instance of it

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
const server = require("http").Server(app);
// const mqttRouter = require("./routes/mqtt.routes");



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
var conf = require("./conf/topicMananger");
conf.checkGatewayInitialization();
conf.subscribtion(mqttClient);

mqttClient.on("connect", () => {
    // console.log("connected  " + mqttClient.connected);
});

mqttClient.on("error", (err) => {
    console.log("Can't connect" + err);
    process.exit(1);
});

mqttClient.on("message", (topic, message, packet) => {
    conf.topicHandler(topic, message, packet);
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static("public"));


// status receiver ----------------------------------------
var webAPIRouter = require("./routes/webAPI.routes");
app.use("/webapi", webAPIRouter);
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