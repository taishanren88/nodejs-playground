'use strict';

var express = require('express');
var cors = require('cors');
var formidable = require('formidable');

// require and use "multer"...

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});

app.post('/api/fileanalyse', function (req, res){
    var form = new formidable.IncomingForm();

    form.parse(req);
    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/uploads/' + file.name;
    });

    form.on('file', function (_name, file){
        console.log('Uploaded ' + file.name + ' with data size ' + file.bytes);
        res.json({name: file.name, type: file.type, size : file.size});

    });

     form.on('end', function () {
     	console.log('done uploading file')
    });
});
app.listen(process.env.PORT || 4000, function () {
  console.log('Node.js listening ...');
});
