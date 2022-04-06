const mongoose = require('mongoose');

const ReferralSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    userEmail: {
        type: String,
    },
    setToRole: {
        type: String,
    },
    key: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    usedBy: {
        type: [String],
    },
    expiration: {
        type: Date,
        default: () => Date.now() + 30 * 24 * 60 * 60 * 1000, //30 days from today
    },
});

module.exports = Referral = mongoose.model('referral', ReferralSchema);
