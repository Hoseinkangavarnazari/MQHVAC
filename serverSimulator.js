// Require express and create an instance of it
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
var cors = require('cors');
const app = express();
const server = require("http").Server(app);
var logger = require("./config/logger");
// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

app.use(cookieParser());
app.use(cors());

// Actuator initialization ................................
const IoTConfiguration = require("./config/IoTManager")
 IoTConfiguration.initialization();
 IoTConfiguration.subscribtion();

// app.use(express.static(__dirname + '/public'));

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
        msgBody: req.body,
        res: res.body,
        resStatus: res.status
        })
    next();
})

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

app.get("/*", function (req, res, next) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
  });

//SEVER
const PORT = 2999;
app.listen(PORT, function () {
    console.log("Server application is listening port " + PORT + ".");
});