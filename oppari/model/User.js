const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  newPassword: {
    type: String,
    required: false
  },
  admin: {
    type: Boolean,
    required: false
  }
});

// export model user with UserSchema
module.exports = mongoose.model("user", UserSchema, "users");
