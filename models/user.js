const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username : {
    type: String,
    required: [true, "Please fill this out.."],
    unique: true
  },
  fullname : {
    type: String,
    required: [true, "Please fill this out.."]
  }, 
  email : {
    type: String,
    required: [true, "Please fill this out.."],
    lowercase : true,
    unique: true
  },
  phoneNumber: {
    type: Number,
    required: [true, 'Please filled this out..'],
  },
  password : {
    type: String,
    required: [true, "Please fill this out.."]
  },
  conPass : {
    type: String,
    required: [true, "Please fill this out.."]
  },
  country : {
    type: String,
    required: [true, "Please fill this out.."]
  },
  refferals : {
    type: String,
  },
  admin: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin"
  }],
  verify: {
    type: Boolean,
    default: false
  },
  token: {
    type: String
  }
},{
  timestamps: true
});

const users = mongoose.model("users", userSchema);

module.exports = users;