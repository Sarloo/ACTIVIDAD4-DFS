const mongoose = require("mongoose");

const accessLogSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  loginAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("AccessLog", accessLogSchema);
