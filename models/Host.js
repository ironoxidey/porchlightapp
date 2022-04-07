const mongoose = require('mongoose');

const HostSchema = new mongoose.Schema(
    {
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
        phone: {
            type: String,
            required: true,
        },
        connectionToUs: {
            type: String,
        },
        primarySpace: {
            type: String,
        },
        specificBand: {
            type: String,
        },
        venueStreetAddress: {
            type: String,
            required: true,
        },
        venueCity: {
            type: String,
            required: true,
        },
        venueState: {
            type: String,
            required: true,
        },
        venueZipCode: {
            type: Number,
            required: true,
        },
        venueNickname: {
            type: String,
        },
        backupPlan: {
            type: String,
        },
        maxNumAttendees: {
            type: Number,
        },
        seatingProvided: {
            type: String,
        },
        venueImg: {
            type: String,
        },
        specialNavDirections: {
            type: String,
        },
        //maybe these next ones are EVENT specific
        overnight: {
            type: String,
        },
        overnightArrangements: {
            type: String,
        },
        guaranteeHonorarium: {
            type: String,
        },
        extraClarification: {
            type: String,
        },
        lastLogin: {
            type: Date,
        },
    },
    { timestamps: true }
);

module.exports = Host = mongoose.model('host', HostSchema);
