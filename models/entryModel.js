var mongoose = require("mongoose");

var entrySchema = mongoose.Schema({
  name: String,
  contest: String,
  score: Number,
  timesecs: Number
});

module.exports = mongoose.model("Entry", entrySchema);
