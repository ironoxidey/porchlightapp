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
        type: [String],
        enum: ['ADMIN', 'ARTIST', 'ATTENDER', 'BOOKING', 'HOST'],
        default: 'ATTENDER',
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    calendly: {
        authCode: {
            //user pastes from 'code' url variable
            type: String,
        },
        accessToken: {
            type: String,
        },
        refreshToken: {
            type: String,
        },
        expiresIn: {
            type: Number,
        },
        createdAt: {
            type: Number,
        },
        owner: {
            type: String,
        },
        organization: {
            type: String,
        },
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
        default: '',
    },
});

module.exports = User = mongoose.model('user', UserSchema);
