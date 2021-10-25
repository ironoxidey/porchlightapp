const mongoose = require('mongoose');

const HostSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: Number,
    required: true
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
});

module.exports = Host = mongoose.model('host', HostSchema);
