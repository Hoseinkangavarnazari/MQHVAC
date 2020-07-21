/*
Here we should enter the spec of connection to the database
*/

var mongoose = require('mongoose');
db = "mongodb://localhost:27017/hvacTest";

// connect to mongo function
const open = () => {
    let connection = mongoose.connection;
    mongoose.Promise = global.Promise;
    mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => console.log(err.reason));;
    connection.on('open', () => {
        console.log('::: Connection with MongoDB established');
    });
    return connection;
};

open();


// const open = () => {
//     let connection = mongoose.connection;
//     try {
//         await mongoose.connect(db, { useNewUrlParser: true });

//         connection.on('open', () => {
//             console.log('::: Connection with MongoDB established');
//         });

//         return connection;

//     } catch (error) {
//         handleError(error);
//     }
// }

// open();


module.exports = open