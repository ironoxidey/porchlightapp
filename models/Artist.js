const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema({
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
    lowercase: true
  },
  stageName: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  medium: {
    type: String,
  },
  genre: {
    type: String,
  },
  repLink: {
    type: String,
  },
  helpKind: {
    type: String,
  },
  artistStatementVideo: {
    type: String,
  },
  streamingPlatforms: {
    amazon: {
        type: String,
    },
    spotify: {
        type: String,
    },
    soundcloud: {
        type: String,
    },
    bandcamp: {
        type: String,
    },
    youtube: {
        type: String,
    },
  },
  social: {
    twitter: {
        type: String,
    },
    facebook: {
        type: String,
    },
    instagram: {
        type: String,
    },
  },
  website: {
    type: String,
  },
  zoomDate: {
    type: Date,
  },
  typeformDate:{
    type: Date,
  },
  hadMeeting: {
    type: Boolean,
    default: false
  },
  sentFollowUp: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
  },
  promotionApproval: {
    type: Boolean,
  },
  //booking info
  phone: {
    type: String,
  },
  hometown: {
    type: String,
  },
  costStructure: {
    type: String,
  },
  namedPrice: {
    type: String,
  },
  bookingWhenWhere: {
    type: String,
  },
  setLength: {
    type: String,
  },
  schedule: {
    type: String,
  },
  overnight: {
    type: Boolean,
  },
  openers: {
    type: String,
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
    type: String,
  },
  allowKids: {
    type: Boolean,
  },
  soundSystem: {
    type: String,
  },
  wideImg: {
    type: String,
  },
  squareImg: {
    type: String,
  },
  covidPrefs: {
    type: String,
  },
  artistNotes: {
    type: String,
  },
  financialHopes: {
    type: String,
  },
  onboardDate: {
    type: Date,
  },
  //extra info
  bio: {
    type: String,
  }
}, {timestamps: true});

module.exports = Artist = mongoose.model('artist', ArtistSchema);
