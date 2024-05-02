const mongoose = require('mongoose');

const HostReviewsEventSchema = new mongoose.Schema(
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

        processOfConnecting: {
            type: Number,
        },
        curationSuggestions: {
            type: String,
        },
        howMuchAttentionToGuide: {
            type: String,
        },
        howHelpfulWasGuide: {
            type: Number,
        },
        guideSuggestions: {
            type: String,
        },
        eventbriteExperience: {
            type: Number,
        },
        eventbriteSuggestions: {
            type: String,
        },
        porchlightCommunications: {
            type: Number,
        },
        artistCommunications: {
            type: Number,
        },
        attendanceExpectations: {
            type: String,
        },
        promotionInsight: {
            type: String,
        },
        experienceMeetingArtist: {
            type: String,
        },
        audienceInteraction: {
            type: String,
        },
        artistVibe: {
            type: Number,
        },
        artistMusicalSkill: {
            type: Number,
        },
        artistVocalSkill: {
            type: Number,
        },
        artistSongwritingSkill: {
            type: Number,
        },
        overnightExperience: {
            type: Number,
        },
        critiqueOfArtist: {
            type: String,
        },
        critiqueOfPorchlight: {
            type: String,
        },
        experienceWithPorchlight: {
            type: String,
        },
        mediaContent: {
            type: [String],
        },
        testimonial: {
            type: String,
        },
        willingToShareMore: {
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

module.exports = HostReviewsEvent = mongoose.model(
    'hostreviewsevent',
    HostReviewsEventSchema
);
