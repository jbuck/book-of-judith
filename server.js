var express = require("express"),
    habitat = require("habitat"),
    knox = require("knox");

habitat.load();

var app = express(),
    env = new habitat(),
    middleware = require( "./lib/middleware" ),
    routes = require( "./routes" ),
    s3 = knox.createClient({
      key: env.get("AWS_ID"),
      secret: env.get("AWS_SECRET"),
      bucket: env.get("AWS_BUCKET")
    });

app.use(express.logger());
app.use(express.compress());
app.use(express.static(__dirname + "/public"));
app.use(express.bodyParser());

app.post("/upload", middleware.uploadToS3( s3 ), routes.upload);

app.listen(env.get("PORT"), function() {
  console.log("Server listening at http://localhost:%d", env.get("PORT"));
});
