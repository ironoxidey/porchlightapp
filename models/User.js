const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum : ['ARTIST','HOST', 'BOTH','ADMIN','ATTENDER'],
    default: 'ATTENDER'
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  resetLink: {
    data: String,
    default: ''
  }
});

module.exports = User = mongoose.model('user', UserSchema);
