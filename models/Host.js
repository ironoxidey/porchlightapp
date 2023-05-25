const mongoose = require('mongoose');

const HostSchema = new mongoose.Schema(
    {
        active: {
            type: Boolean,
            default: true,
        },
        lastEmailed: {
            type: Date,
            // default: Date.now, //needing a default to check against for first email
            //default: new Date('2022-01-17T20:16:26.421+00:00'), //needing a default to check against for first email
        },
        notificationFrequency: {
            //in number of days — 0 means never
            type: Number,
            default: 7,
        },
        completedProfileForm: {
            type: Boolean,
            default: false,
        },
        mailChimped: {
            type: Boolean,
            default: false,
        },
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
        geocodedStreetAddress: {
            type: String,
        },
        city: {
            type: String,
            required: true,
        },
        geocodedCity: {
            type: String,
        },
        state: {
            type: String,
            required: true,
        },
        geocodedState: {
            type: String,
        },
        zipCode: {
            type: Number,
            required: true,
        },
        geocodedZipCode: {
            type: Number,
        },
        profileImg: {
            type: String,
        },
        timezone: {
            type: String,
        },
        timezoneOffset: {
            type: String,
        },
        latLong: {
            //https://mongoosejs.com/docs/geojson.html#
            type: {
                type: String, // Don't do `{ latLong: { type: String } }`
                enum: ['Point'], // 'latLong.type' must be 'Point'
                required: true,
                default: 'Point',
            },
            coordinates: {
                type: [Number],
                required: true,
            },
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
            default: 'residence',
        },
        specificBand: {
            type: String,
        },
        venueStreetAddress: {
            type: String,
        },
        venueCity: {
            type: String,
        },
        venueState: {
            type: String,
        },
        venueZipCode: {
            type: Number,
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
