const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("./app_api/models/db");
const routes = require("./app_server/routes/locations");
const routesApi = require("./app_api/routes/locations")

const app = express();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "/app_server/views"));
app.set("view engine", "pug");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, "/public")));

app.use(routes);
app.use(routesApi);

if ("development" == app.get("env")) {
    app.use(function(error, request, response, next) {
        response.status(error.status || 500);
        response.render("error", {
            message: error.message,
            error: error
        });
    });
}

module.exports = app.listen(app.get("port"), function() {
    console.log("Express server listening on port " + app.get("port"));
});