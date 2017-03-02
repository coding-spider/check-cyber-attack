var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

var router = require('./routes/router');

//Server static web files
app.use(express.static('web'));

//Set up routes
app.use('/', router);

//Start app
app.listen(port, function() {
    console.log("App server started at ", port);
});
