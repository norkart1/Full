
const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  value: { type: String, required: true, unique: true },
  isSingle: { type: Boolean, default: false },
  isGroup: { type: Boolean, default: false },
  type: { type: String, enum: ['Kids', 'Sub-Junior', 'Junior', 'Senior', 'Super Senior','General'], required: true },
  gender: { type: String, enum: ['Girl', 'Boy'], required: true },
  createdAt: { type: Date, default: Date.now },

  //default null bellow data;
  participants: [
    {
      teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team", // Reference to the Team model
        required: true,
      },
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student", // Reference to the Student model
        required: true,
      },
      score: { type: Number, default: 0 },
      rank: { type: Number, default: 0 },
    },
  ],
});


const Program = mongoose.model("Program", programSchema);
module.exports = Program;
