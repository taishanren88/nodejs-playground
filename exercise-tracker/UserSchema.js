const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserEntry = new Schema(
  {
    username: {
      type: String
    }
  },
  {
    collection: "users"
  }
);

module.exports = mongoose.model("User", UserEntry);