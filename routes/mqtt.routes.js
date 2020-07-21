var status_controller = require('../controllers/mqtt.status.controller');


var funcA = (gatewaySpec, msg) => {
    console.log("Function A");
    console.log(msg.toString());
}

var funcB = (gatewaySpec, msg) => {
    console.log("Function B");
    console.log(msg.toString());
}


var writeNewStatus = (gatewaySpec, msg) => { status_controller.writeNewStatus(gatewaySpec, msg) }



module.exports = {
    funcA,
    funcB,
    writeNewStatus
}