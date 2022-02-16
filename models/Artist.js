const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema(
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
			unique: true,
			lowercase: true,
		},
		stageName: {
			type: String,
			required: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		medium: {
			type: String,
		},
		genres: {
			type: Object,
		},
		soundsLike: {
			type: Object,
		},
		repLinks: {
			type: Object,
		},
		repLink: {
			type: String,
		},
		socialLinks: {
			type: Object,
		},
		streamingLinks: {
			type: Object,
		},
		helpKind: {
			type: String,
		},
		artistStatementVideo: {
			type: String,
		},
		livePerformanceVideo: {
			type: String,
		},
		artistWebsite: {
			type: String,
		},
		zoomDate: {
			type: Date,
		},
		typeformDate: {
			type: Date,
		},
		hadMeeting: {
			type: Boolean,
			default: false,
		},
		sentFollowUp: {
			type: Boolean,
			default: false,
		},
		active: {
			type: Boolean,
			default: false,
		},
		notes: {
			type: String,
		},
		promotionApproval: {
			type: String,
		},
		//booking info
		phone: {
			type: String,
		},
		website: {
			type: String,
		},
		hometown: {
			type: String,
		},
		streetAddress: {
			type: String,
		},
		city: {
			type: String,
		},
		state: {
			type: String,
		},
		zip: {
			type: Number,
		},
		costStructure: {
			type: String,
		},
		namedPrice: {
			type: String,
		},
		tourVibe: {
			type: String,
		},
		bookingWhen: {
			type: [String],
		},
		bookingWhenWhere: {
			type: Object,
		},
		payoutPlatform: {
			type: String,
			default: 'PayPal'
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
		companionTravelers: {
			type: String,
		},
		hangout: {
			type: String,
		},
		merchTable: {
			type: Boolean,
		},
		allergies: {
			type: Object,
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
			default: false,
		},
		agreeToPromote: {
			type: Boolean,
			default: false,
		},
		wideImg: {
			type: String,
		},
		squareImg: {
			type: String,
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
		fanActions: {
			type: Object,
		},
		onboardDate: {
			type: Date,
		},
		artistUpdated: {
			type: Date,
		},
		//extra info
		bio: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = Artist = mongoose.model('artist', ArtistSchema);
