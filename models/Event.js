const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
    {
        artist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'artist',
        },
        artistSlug: {
            type: String,
        },
        artistUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        artistEmail: {
            type: String,
        },
        hostsOfferingToBook: {
            type: [String],
        },
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
