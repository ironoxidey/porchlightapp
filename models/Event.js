const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
    {
        artist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'artist',
            required: true,
        },
        artistSlug: {
            type: String,
            required: true,
        },
        artistUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        artistEmail: {
            type: String,
            required: true,
        },
        hostsOfferingToBook: {
            type: [String],
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
        hostReachRadius: {
            type: Number,
            default: 40, //the distance is actually in meters, but I'm storing miles and converting it when I make the call to the database, 1609.35m = 1 mile
        },
        hostsInReach: [
            {
                host: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'host',
                },
            },
        ],
        offersFromHosts: [
            {
                host: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'host',
                },
                status: {
                    type: String,
                    default: 'OFFERED',
                },
                showSchedule: {
                    setupTime: {
                        type: String,
                    },
                    startTime: {
                        type: String,
                    },
                    doorsOpen: {
                        type: String,
                    },
                    hardWrap: {
                        type: String,
                    },
                },
                refreshments: {
                    type: Object,
                },
                seatingProvided: {
                    type: String,
                },
                overnight: {
                    type: String,
                },
                overnightArrangements: {
                    type: String,
                },
                openers: {
                    type: String,
                },
                houseRules: {
                    type: String,
                },
                eventbritePublicAddress: {
                    type: String,
                },
                additionalRequests: {
                    type: String,
                },
                guaranteeHonorarium: {
                    type: String,
                },
                honorariumAmount: {
                    type: String,
                },
                extraClarification: {
                    type: String,
                },
                artistViewedOn: {
                    type: Date,
                },
            },
        ],
        confirmedHost: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'host',
        },
        confirmedHostUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        confirmedHostEmail: {
            type: String,
        },
        confirmedDate: {
            type: Date,
        },
        costStructure: {
            type: String,
        },
        namedPrice: {
            type: String,
        },
        tourVibe: {
            type: [String],
        },
        bookingWhen: {
            type: Date,
            required: true,
        },
        bookingWhere: {
            type: Object,
        },
        payoutPlatform: {
            type: String,
            default: 'PayPal',
        },
        payoutHandle: {
            type: String,
        },
        setLength: {
            type: String,
        },
        schedule: {
            type: String,
        },
        showSchedule: {
            setupTime: {
                type: String,
                default: '17:45',
            },
            startTime: {
                type: String,
                default: '19:00',
            },
            doorsOpen: {
                type: String,
                default: '18:30',
            },
            hardWrap: {
                type: String,
                default: '21:00',
            },
            flexible: {
                type: Boolean,
                default: true,
            },
        },
        overnight: {
            type: String,
        },
        openers: {
            type: String,
        },
        travelingCompanions: {
            type: Object,
        },
        hangout: {
            type: String,
        },
        merchTable: {
            type: Boolean,
        },
        familyFriendly: {
            type: Boolean,
        },
        allowKids: {
            type: Boolean,
        },
        alcohol: {
            type: Boolean,
        },
        soundSystem: {
            type: String,
        },
        agreeToPayAdminFee: {
            type: Boolean,
        },
        agreeToPromote: {
            type: Boolean,
        },
        covidPrefs: {
            type: Object,
        },
        artistNotes: {
            type: String,
        },
        financialHopes: {
            type: String,
        },
        status: {
            type: String,
            default: 'PENDING',
        },
    },
    { timestamps: true }
);

module.exports = Event = mongoose.model('event', EventSchema);
