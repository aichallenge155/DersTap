const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500
  },
  subject: {
    type: String,
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  lessonDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Bir tələbə bir müəllimə yalnız bir dəfə rəy verə bilər
reviewSchema.index({ teacherId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);