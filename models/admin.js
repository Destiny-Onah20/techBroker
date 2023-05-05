const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username : {
    type: String,
    required: [true, "please this filled should not be empty."],
    unique: true
  },
  password : {
    type: String,
    required: [true, "please this filled should not be empty."]
  },
  refferals : {
    type: String,
    required: [true, "please this filled should not be empty."]
  },
  adminUser : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  }],
  token: {
    type : String
  }
},{
  timestamps: true
});

const admin = mongoose.model("admin", adminSchema);

module.exports = admin;