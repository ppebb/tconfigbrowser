var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
var fs = require("fs");
var favicon = require("serve-favicon");

var app = express();
app.listen(4000);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/mods", express.static(__dirname + "/mods"));
app.use(favicon(path.join(__dirname, "/favicon.png")));

var modsJson = fs.readFileSync("./metadata.json", "utf8");
var modsArray = JSON.parse(modsJson);
var modsDict = {};
for (i in modsArray) {
    modsDict[modsArray[i].name + ".obj"] = modsArray[i];
}

app.get("/allmods", function(_, res, _) {
    res.send(modsJson);
});

app.get("/modinfo", function(req, res, _) {
    var mod = modsDict[req.query.name];

    if (mod == null) {
        res.send("error");
    }

    res.send(mod);
});

app.get("/", function(req, res, _) {
    res.sendFile(path.join(__dirname, "/index.html"));
});

// catch 404 and forward to error handler
app.use(function(_, _, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, _) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send("error");
});

module.exports = app;
