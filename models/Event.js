const mongoose = require('mongoose');
const declinedHostSchema = new mongoose.Schema(
    {
        host: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'host',
        },
    },
    { timestamps: true }
);

const EventSchema = new mongoose.Schema(
    {
        createdBy: {
            type: String,
            required: true,
            default: 'ARTIST',
        },
        artist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'artist',
            //required: true, //commented out June 27th, 2022 to make way for Host's to propose events
        },
        artistSlug: {
            type: String,
            //required: true, //commented out June 27th, 2022 to make way for Host's to propose events
        },
        artistUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        artistEmail: {
            type: String,
            //required: true, //commented out June 27th, 2022 to make way for Host's to propose events
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
                default: [0, 0],
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
        declinedHosts: [declinedHostSchema],
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
                // refreshments: {
                //     type: Object,
                // },
                refreshments: {
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
                seatingProvided: {
                    type: String,
                },
                streetAddress: { type: String },
                city: { type: String },
                state: { type: String },
                zipCode: { type: Number },

                numDraw: {
                    type: Number,
                },
                maxNumAttendees: {
                    type: Number,
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
        geocodedBookingWhere: {
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
        allergies: {
            type: Object,
        },
        merchTable: {
            type: Boolean,
        },
        promotionApproval: {
            type: String,
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
        hostNotes: {
            type: String,
        },
        financialHopes: {
            type: String,
        },
        fanActions: {
            type: Object,
        },
        status: {
            type: String,
            default: 'PENDING',
        },
        artistUpdated: {
            type: Date,
        },
        hostUpdated: {
            type: Date,
        },
        confirmedArtist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'artist',
        },
        preferredArtists: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'artist',
            },
        ],
        declinedArtists: [
            {
                artist: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'artist',
                },
                message: {
                    type: String,
                },
            },
        ],
        artistReviewOfHost: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'artistreviewshost',
        },
        hostReviewOfEvent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'hostreviewsevent',
        },
        driveFolderID: { type: String },
        uploadedFiles: [
            {
                name: { type: String },
                url: { type: String },
                driveID: { type: String },
                filetype: { type: String },
            },
        ],
    },
    { timestamps: true }
);
EventSchema.index({ latLong: '2dsphere' });
module.exports = Event = mongoose.model('event', EventSchema);
//module.exports = Event = mongoose.model('trash', EventSchema);
