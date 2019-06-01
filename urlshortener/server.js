var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");

var cors = require("cors");
var bodyParser = require("body-parser");
var dns = require("dns");

const config = require("./db");
const longUrlMapping = require("./urlschema").longurlschema;
const shortUrlMapping = require("./urlschema").shorturlschema;

const mydb = config.DB;
var app = express();

// Basic Configuration
var port = 8909;

/** this project needs a db !! **/

mongoose.connect(mydb, { useNewUrlParser: true }).then(
	() => {
		console.log("Database is connected");
	},
	err => {
		console.log("Can not connect to the database" + err);
	}
);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
	res.sendFile(process.cwd() + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function(req, res) {
	res.json({ greeting: "hello API" });
});

app.post("/api/shorturl/new", function(req, res) {
	function long2Short(url) {
		var short = "";
		var charmapping =
			"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		for (i = 0; i < 6; i++) {
			var num = Math.floor(Math.random() * 62);
			short += charmapping.charAt(num);
		}
		return short;
	}

	var original = req.body.longurl;
	longUrlMapping.findOne({ longurl: original }, function(err, document) {
		if (document) {
			console.log(
				"result already exists,..returning... +" + document.shorturl
			);
			res.json({ original_url: original, short_url: document.shorturl });
		} else {
			//First check if it's a valid DNS first
			console.log("original url is " + original);
			var cleanupurl = original.replace(/^(https?:)\/\//, "");
			console.log("cleaned up url " + cleanupurl);
			dns.lookup(cleanupurl, function(err, addresses, family) {
				if (err) {
					console.log("invalid lookup " + err);
					res.send({ error: "invalid URL" });
					return;
				}
				var shortened = long2Short(original);
				const longurlentry = new longUrlMapping({
					longurl: original,
					shorturl: shortened
				});
				longurlentry.save();

				const shorturlentry = new shortUrlMapping({
					shorturl: shortened,
					longurl: original
				});
				shorturlentry
					.save()
					.then(entry => {
						// HTTP response
						res.json({
							original_url: original,
							short_url: shortened
						});
					})
					.catch(err => {
						res.status(400).send("unable to save to database");
					});
			});
		} // end else
	}); // end findOne
});

app.get("/api/shorturl/:shorturlparam", function(req, res) {
	console.log("processing  paramemter" + req.params.shorturlparam);
	shortUrlMapping.findOne({ shorturl: req.params.shorturlparam }, function(
		err,
		document
	) {
		if (document) {
			console.log("found log url as " + document.longurl);
			res.redirect(document.longurl);
		} else {
			res.send({ error: "invalid URL" });
		}
	});
});

app.listen(port, function() {
	console.log("Node.js listening ...");
});
