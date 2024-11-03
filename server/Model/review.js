// models/Review.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  review: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  // Optional: Add user info, like userId, name, etc.
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
