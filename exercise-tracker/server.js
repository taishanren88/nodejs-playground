const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')
const ObjectId = require('mongodb').ObjectID;
const mongoose = require('mongoose')
const UserEntry = require("./UserSchema");
const ExerciseEntry = require("./ExerciseSchema");
const mydb = 'mongodb://localhost/exercise-track' ;

mongoose.connect(mydb, { useNewUrlParser: true }).then(
  () => {
    console.log("Database is connected");
  },
  err => {
    console.log("Can not connect to the database" + err);
  }
);

mongoose.connect(mydb)

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

app.post("/api/exercise/new-user", (req, res, next) => {
  const _username = req.body.username;
  if (!_username) {
    return next('invalid username')
  }
  UserEntry.findOne({ username: _username }, (err, document) => {
    if (document) {
      res.send("username already taken");
    } else {
      const userentry = new UserEntry({
        username: _username
      });
      userentry
        .save()
        .then(entry => {
          // HTTP response
          console.log('entry is ' + entry)
          res.json({
            username: entry.username,
            _id: entry._id
          });
        })
        .catch(err => {
          res.status(400).send("unable to save to database");
        });
    }
  });
});

app.post("/api/exercise/add", (req, res, next) => {
  const _userId = req.body.userId
  const _description = req.body.description;
  const _duration = req.body.duration;
  const _date = req.body.date;
  if (!_userId)
    return next('unknown _id')
  if (!_description) 
    return next('unknown description')
  if (!_duration)
    return next('unknown duration')


  const _dateObj = _date ? new Date(_date) : new Date();
  if (!_dateObj) {
    return next('invalid date')
  }
  console.log('Processing add exercise request')
    UserEntry.findOne({ _id: _userId }, (err, document) => {
    if (err) {
      return next(err)
    } else {
      const exercise_entry = new ExerciseEntry({
        userid: _userId,
        description: _description,
        duration: _duration,
        date: _dateObj
      });
      exercise_entry
        .save()
        .then(entry => {
          // HTTP response
          res.json({
            username: entry.username,
            _id: entry.userid,
            description: entry.description,
            duration: entry.duration,
            date: entry.date
          });
        })
        .catch(err => {
          res.status(400).send("unable to save to database");
          next(err)
        });
    }
  });
});

//
app.get("/api/exercise/log/:userId/:from?/:to?/:limit?", (req, res, next) => {
     const  {userId, from , to , limit } = req.params;
    console.log('requesting for: '+ userId + ' from:' + from + '->' + to + ' with limit ' + limit);
    const fromDate = from ? new Date(from) : new Date(0);
    const toDate = to ? new Date(to) : new Date();
    var query = {};
    query['userid'] = ObjectId(userId);

     ExerciseEntry.find(query, {_id:false, userid: false, __v: false}
                       ).where('userid').equals(ObjectId(userId))
                          .where('date').gte(fromDate)
                          .where('date').lte(toDate).limit(!limit ? 0 : limit)
                          .then( result => {
                            var log =""
                            for (var i = 0;i< result.length;i++){
                                log += i +1 + '.' + result[i].toString() +'\n';
                              }
                          res.send(log)
                       }).catch( err =>  next(err));
              });
        
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
  console.log('You can run commands like: \x1b[32;4m curl -X POST  -d "username=abcd" http://localhost:3000/api/exercise/new-user\x1b[0m')
})
