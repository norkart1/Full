
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    image: { type: String, default: "" }, // Optional field for image URL/path
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team", // Reference to the School model
      required: true,
    },
    ageGroup: { type: String, enum: ['Kids', 'Sub-Junior', 'Junior', 'Senior', 'Super Senior'], required: true },
    createdAt: { type: Date, default: Date.now },
  });
  

const Student = mongoose.model('Student',studentSchema);

module.export = Student;