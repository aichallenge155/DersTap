const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subjects: [{
    type: String,
    required: true
  }],
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  education: {
    type: String,
    required: true
  },
  // Online və Offline qiymətlər
  onlineRate: {
    type: Number,
    default: 0,
    min: 0
  },
  offlineRate: {
    type: Number,
    default: 0,
    min: 0
  },
  teachingMode: {
    type: [String],
    enum: ['online', 'offline'],
    required: true,
    validate: [arrayLimit, 'Ən azı bir tədris növü seçin']
  },
  grade: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    maxlength: 500
  },
  profileImage: {
    type: String,
    default: ''
  },
  availableHours: [{
    day: String,
    startTime: String,
    endTime: String
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  profileViews: {
    type: Number,
    default: 0
  },
  completedLessons: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Array validator
function arrayLimit(val) {
  return val.length >= 1;
}

// Reytinq hesablama metodu
teacherSchema.methods.calculateRating = function() {
  return this.rating;
};

// Qiymət göstərmə metodu
teacherSchema.methods.getDisplayPrice = function() {
  const modes = this.teachingMode;
  if (modes.includes('online') && modes.includes('offline')) {
    return `${Math.min(this.onlineRate, this.offlineRate)}-${Math.max(this.onlineRate, this.offlineRate)} ₼`;
  } else if (modes.includes('online')) {
    return `${this.onlineRate} ₼ (Online)`;
  } else {
    return `${this.offlineRate} ₼ (Offline)`;
  }
};

module.exports = mongoose.model('Teacher', teacherSchema);