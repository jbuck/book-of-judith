var express = require("express"),
    habitat = require("habitat");

habitat.load();

var app = express(),
    env = new habitat();

app.use(express.logger());
app.use(express.compress());
app.use(express.static(__dirname + "/public"));

app.listen(env.get("PORT"), function() {
  console.log("Server listening at http://localhost:%d", env.get("PORT"));
});
