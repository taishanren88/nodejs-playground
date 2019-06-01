const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const ExerciseEntry = new Schema(
  {
  	userid: {
  		type: ObjectId
  	},
    description: {
    	type: String
    },
    duration: {
    	type: Number
    },
    date: {
    	type: Date
    } 
  },
  {
    collection: "exercises"
  }
);

module.exports = mongoose.model("Exercise", ExerciseEntry);