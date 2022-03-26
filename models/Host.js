const mongoose = require('mongoose');

const HostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
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
    },
    phone: {
        type: String,
        required: true,
    },
    streetAddress: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zipCode: {
        type: Number,
        required: true,
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    numDraw: {
        type: Number,
    },
    numHostedBefore: {
        type: Number,
    },
    connectionToUs: {
        type: String,
    },
    venueNickname: {
        type: String,
    },
    planB: {
        type: String,
    },
});

module.exports = Host = mongoose.model('host', HostSchema);
