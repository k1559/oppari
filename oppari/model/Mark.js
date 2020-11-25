const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MarkSchema = new Schema({
  hours: {
    type: Number,
    required: true
  },
  minutes: {
    type: Number,
    required: true
  },
  textarea: {
    type: String,
    required: false
  },
  date: {
      type: Date,
      required: false
  },
  userid: {
    type: String,
    required: false
  },
  useremail: {
    type: String,
    required: false
  }
});

// export model mark with MarkSchema
module.exports = mongoose.model("mark", MarkSchema, 'marks');
