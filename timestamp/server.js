// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/timestamp/:date_string?", function (req, res) {
     console.log('here')
     var date;

	if(!req.params.date_string){
		// do something when there is no optionalParam
		date = new Date()
	  }
	else {
		if (isNaN(req.params.date_string))
			date = new Date(req.params.date_string); // valid string
		else 
			date = new Date(+req.params.date_string); // convert to integer
	}

	res.json({ unix: date.getTime(), utc: date.toUTCString()});
});



// listen for requests :)
var DEFAULT_PORT = 8909
var listener = app.listen(DEFAULT_PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});