var status_controller = require('../controllers/mqtt.status.controller');



var writeNewStatus = (gatewaySpec, msg) => { status_controller.writeNewStatus(gatewaySpec, msg) }
var writeNewLog = (gid,msg) =>{status_controller.writeNewLog(gid,msg)}



module.exports = {
    writeNewStatus,
    writeNewLog
}