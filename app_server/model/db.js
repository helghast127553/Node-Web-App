let mongoose = require("mongoose");
let readline = require("readline");

//Build Connection String
let dbUrl = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";

//Create the database connection
mongoose.connect(dbUrl);

mongoose.connection.on("connected", function() {
    console.log("Mongoose connected to " + dbUrl);
});

mongoose.connection.on("error", function(error) {
    console.log("Mongoose connection error " + error);
});

mongoose.connection.on("disconnected", function() {
    console.log("Mongoose disconnected");
});

let shutdown = function(message, callbackFunction) {
    mongoose.connection.close(function() {
        console.log("Mongoose disconnected through " + message);
        callbackFunction();
    });
};

process.on("SIGUSR2", function() {
    shutdown("nodemon restart", function() {
        process.kill(process.pid, "SIGUSR2");
    });
});

process.once("SIGINT", function() {
    shutdown("app termination", function() {
        process.exit(0);
    });
});

process.on("SIGTERM", function() {
    shutdown("Heroku app shutdown", function() {
        process.kill(0);
    });
});

require("./locations");