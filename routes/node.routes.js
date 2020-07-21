var express = require('express');
var node_router = express.Router();

// Require controller modules.
var node_controller = require('../controllers/node.controller');




//  Post requests

node_router.post('/update', node_controller.statusUpdate);


module.exports = node_router;