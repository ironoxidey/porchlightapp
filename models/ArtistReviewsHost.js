const mongoose = require('mongoose');

const ArtistReviewsHostSchema = new mongoose.Schema(
    {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'event',
        },
        artistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'artist',
        },
        hostId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'host',
        },
        bookingWhen: {
            type: Date,
        },
        bookingWhere: {
            type: Object,
        },
        communication: {
            type: Number,
        },
        promotion: {
            type: Number,
        },
        tipsDonations: {
            type: Number,
        },
        merchSales: {
            type: Number,
        },
        ticketSales: {
            type: Number,
        },
        revenueExpectations: {
            type: String,
        },
        attendanceExpectations: {
            type: String,
        },
        audienceQuality: {
            type: String,
        },
        venueQuality: {
            type: Number,
        },
        everythingNeeded: {
            type: Number,
        },
        introductionByHost: {
            type: Number,
        },
        hostExample: {
            type: Number,
        },
        hostInteractions: {
            type: Number,
        },
        hostAccommodations: {
            type: Number,
        },
        hostCommitment: {
            type: Number,
        },
        recHostForRetreat: {
            type: String,
        },
        artistNotes: {
            type: String,
        },
        typeformSubmittedAt: {
            type: Date,
        },
        typeformAddress: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = ArtistReviewsHost = mongoose.model(
    'artistreviewshost',
    ArtistReviewsHostSchema
);
