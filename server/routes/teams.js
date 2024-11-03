const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("node:path");
const fs = require("fs");

const teamController = require("../Controller/teamsCrud");
const upload = require("../Middlewares/multer");
const {
  getAllPrograms,
  addProgram,
  deleteProgramById,
  updateProgramById,
  addTeamToProgram,
  editTeamInProgram,
  deleteTeamFromProgram,
  getTeamProgramDetail,
} = require("../Controller/programCrud");
const Review = require("../Model/review");

// Define storage for the images
const categoryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const mainProductPath = path.join(__dirname, "../public", "programImg");

    if (!fs.existsSync(mainProductPath)) {
      console.log("Directory does not exist, creating...");
      fs.mkdirSync(mainProductPath, { recursive: true });
    }

    if (file.fieldname.startsWith("image")) {
      console.log("Setting destination to programImg folder");
      cb(null, mainProductPath);
    } else {
      console.log("Invalid fieldname");
      cb(new Error("Invalid fieldname"), null);
    }
  },

  filename: function (req, file, cb) {
    console.log("Generating filename for file:", file);
    cb(null, file.originalname, path.extname(file.originalname)); // Append the file extension
  },
});

const categoryUpload = multer({
  storage: categoryStorage,
  limits: { fileSize: 1024 * 1024 * 2 }, // Limit file size to 2MB
});

router.post("/addteam", upload.single("image"), async (req, res) => {
  let io = req.io;

  const { name } = req.body;

  try {
    // Call the teamController to add the team
    const response = await teamController.addTeam(name, req.file.filename, io);

    // Send a success response back to the client
    res.status(200).json(response);
  } catch (error) {
    // Handle any errors that occur during team addition
    console.error("Error adding team:", error);
    res
      .status(500)
      .json({ message: "Failed to add team", error: error.message });
  }
});

router.put("/updateteamBy/:id", upload.single("image"), async (req, res) => {
  let id = req.params.id;
  let teamData = req.body;
  let teamImage = req.file;
  let io = req.io;

  try {
    const response = await teamController.updateTeamById(
      id,
      teamData,
      teamImage,
      io
    );

    // Send a success response back to the client
    res
      .status(200)
      .json({ message: "team updated successfully", team: response });
  } catch (error) {
    console.error("Error updating team:", error);
    res
      .status(500)
      .json({ message: "Failed to update team", error: error.message });
  }
});

router.delete("/deleteteamBy/:id", async (req, res) => {
  const id = req.params.id;
  let io = req.io;

  try {
    // Call the deleteteam function from the controller to delete the team
    const deletedteam = await teamController.deleteTeamById(id, io);

    // If the team was successfully deleted, send a success response
    res.status(200).json({ message: "Franchise deleted successfully" });
  } catch (error) {
    // If an error occurs during deletion, send an error response
    console.error("Error deleting team:", error);
    res
      .status(500)
      .json({ message: "Failed to delete team", error: error.message });
  }
});

router.get("/getAllteams", async (req, res) => {
  try {
    const response = await teamController.getAllTeams();

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch teams", error: error.message });
  }
});

router.get("/getTeamById/:id", async (req, res) => {
  const id = req.params.id;
  console.log("id ", req.params);

  try {
    const response = await teamController.getTeamById(id);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch teams", error: error.message });
  }
});

router.post("/submitReview", async (req, res) => {
  try {
    const { teamId, review } = req.body;

    if (!teamId || !review) {
      return res
        .status(400)
        .json({ message: "Team ID and review are required." });
    }

    // Create a new review entry
    const newReview = new Review({
      teamId,
      review,
    });

    // Save review to the database
    await newReview.save();

    res.status(200).json({ message: "Review submitted successfully!" });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Failed to submit review" });
  }
});

//program rotues

router.get("/getAllPrograms", getAllPrograms);
router.delete("/deleteProgramById/:id", deleteProgramById);
router.put("/updateProgram/:id", updateProgramById);
router.post("/createProgram", addProgram);

router.post("/addTeamToProgram", addTeamToProgram);
router.get("/getTeamProgramDetails", getTeamProgramDetail);
router.put("/editTeamInProgram", editTeamInProgram);
router.delete("/deleteTeamFromProgram", deleteTeamFromProgram);

router.get("/getTeamsByProgram/:id", async (req, res) => {
  const category = req.params.id;

  try {
    const response = await teamController.getTeamByProgram(category);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch teams", error: error.message });
  }
});

module.exports = router;
