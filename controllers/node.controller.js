 var Node = require('../models/node.model');
 // var { DateTime } = require('luxon');



 // Display detail page for a specific Author.

 exports.statusUpdate = async(req, res) => {
     console.log(":::", "Received an unprocessed message. [Gateway Status update EndPoint]")
         // define schema here

     let GID = req.body.GID;
     let sensors = req.body.sensors;

     //  console.log(sensors[0].T)

     addingSensors = [];
     var temp;
     for (var i = 0; i < sensors.length; i++) {

         var temp = {
             SID: sensors[i].SID,
             temperature: sensors[i].T,
             humidity: sensors[i].H
         };
         addingSensors.push(temp);
     }

     console.log(addingSensors);

     var newStatus = new Node({
         GID: GID,
         sensors: addingSensors
     });
     newStatus.sensors = addingSensors;
     try {
         newStatus.save();
         res.send("::: Saved into the database.");
         console.log(":::  Saved into the database.")

     } catch (err) {
         res.send("::: There is something wrong with saving to DB");
         console.log("::: There is something wrong with saving to DB", err)
     }

 }