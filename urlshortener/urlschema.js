const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const longUrlMapping = new Schema(
  {
    longurl: {
      type: String
    },
    shorturl: {
      type: String
    }
  },
  {
    collection: "longurls"
  }
);

const shortUrlMapping = new Schema(
  {
    shorturl: {
      type: String
    },
    longurl: {
      type: String
    }
  },
  {
    collection: "shorturls"
  }
);

module.exports = {
  longurlschema: mongoose.model("Longurl", longUrlMapping),
  shorturlschema: mongoose.model("Shorturl", shortUrlMapping)
};
