var mqtttemp = require('mqtt')
const mqtttempBroker = "mqtt://127.0.0.1"
const options = {qos: 2};
var mqtttempClient = mqtttemp.connect(mqtttempBroker, options);
// adding clients in connection process can harm the entire program 
// at this point I dont know why :D

mqtttempClient.on("connect", () => {
    console.log("connected  " + mqtttempClient.connected);


    mqtttempClient.publish('g2/logs',JSON.stringify({
    
        "time":new Date(),
        "GID":"g2",
        "detail":"FATAl error in gateway",
        "level":"danger",
        "seen":false
        
        }),options,(error)=>{
            if(error){
                console.log("there was an error: ",error);
                return 0 ;
            }else{
                console.log("Schedule published successfully");
            }
        });
});

mqtttempClient.on("error", (err) => {
    console.log("Can't connect" + err);
    process.exit(1)
});





 