const Program = require("../Model/program");
const Teams = require("../Model/teams");
const path = require("path");
const fs = require("fs");

module.exports = {
  // addProgram: async (req, res) => {
  //   const { value, label } = req.body;

  //   console.log("value", value);
  //   console.log("label", label);

  //   const newProgram = new Program({ value, label });

  //   try {
  //     await newProgram.save();
  //     res.status(201).json(newProgram);
  //   } catch (error) {
  //     console.error("Error saving program:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // },

  addProgram: async (req, res) => {
    try {
      const { value, label } = req.body;

      // Create a new program
      const newProgram = new Program({
        value,
        label,
        teams: [], // Empty teams initially
      });

      await newProgram.save();
      res.status(200).json({
        message: "Program created successfully!",
        program: newProgram,
      });
    } catch (error) {
      console.error("Error creating program:", error);
      res.status(500).json({ message: "Error creating program." });
    }
  },

  addTeamToProgram: async (req, res) => {
    try {
      const { teamId, programId, score, rank, isSingle, isGroup } = req.body;

      // Find team and program by their IDs
      const team = await Teams.findById(teamId);
      const program = await Program.findById(programId);

      if (!team || !program) {
        return res.status(404).json({ message: "Team or Program not found." });
      }

      // Check if the team already participated in the program
      const existingParticipation = team.programs.find(
        (p) => p.programId.toString() === programId
      );

      if (existingParticipation) {
        return res
          .status(400)
          .json({ message: "Team has already participated in this program." });
      }

      // Add the team to the program with a score
      team.programs.push({ programId, score, rank, isSingle, isGroup });
      program.teams.push({ teamId, score, rank, isSingle, isGroup });

      // Update the total score of the team
      team.totalScore += score;

      await team.save();
      await program.save();

      res.status(200).json({ message: "Team added to program successfully!" });
    } catch (error) {
      console.error("Error adding team to program:", error);
      res.status(500).json({ message: "Error adding team to program." });
    }
  },

  editTeamInProgram: async (req, res) => {
    try {
      const { teamId, programId, score, rank, isSingle, isGroup } = req.body;

      // Find the team by its ID
      const team = await Teams.findById(teamId);
      const program = await Program.findById(programId);

      if (!team || !program) {
        return res.status(404).json({ message: "Team or Program not found." });
      }

      // Check if the team has already participated in the program
      const teamParticipation = team.programs.find(
        (p) => p.programId.toString() === programId
      );
      const programParticipation = program.teams.find(
        (t) => t.teamId.toString() === teamId
      );

      if (!teamParticipation || !programParticipation) {
        return res
          .status(404)
          .json({ message: "Team is not part of this program." });
      }

      // Adjust the totalScore of the team by subtracting the old score and adding the new one
      team.totalScore = team.totalScore - teamParticipation.score + score;

      // Update the score, rank, and other details in both the team and program
      teamParticipation.score = score;
      teamParticipation.rank = rank;
      teamParticipation.isSingle = isSingle;
      teamParticipation.isGroup = isGroup;

      programParticipation.score = score;
      programParticipation.rank = rank;
      programParticipation.isSingle = isSingle;
      programParticipation.isGroup = isGroup;

      // Save the changes
      await team.save();
      await program.save();

      res.status(200).json({
        message: "Team's details in the program updated successfully!",
      });
    } catch (error) {
      console.error("Error editing team in program:", error);
      res.status(500).json({ message: "Error editing team in program." });
    }
  },

  deleteTeamFromProgram: async (req, res) => {
    try {
      const { teamId, programId } = req.body;

      // Find the team and program by their IDs
      const team = await Teams.findById(teamId);
      const program = await Program.findById(programId);

      if (!team || !program) {
        return res.status(404).json({ message: "Team or Program not found." });
      }

      // Find and remove the team from the program
      const teamParticipation = team.programs.find(
        (p) => p.programId.toString() === programId
      );
      const programParticipation = program.teams.find(
        (t) => t.teamId.toString() === teamId
      );

      if (!teamParticipation || !programParticipation) {
        return res
          .status(404)
          .json({ message: "Team is not part of this program." });
      }

      // Adjust the totalScore of the team by subtracting the current score
      team.totalScore -= teamParticipation.score;

      // Remove the team from both the team's program list and the program's team list
      team.programs = team.programs.filter(
        (p) => p.programId.toString() !== programId
      );
      program.teams = program.teams.filter(
        (t) => t.teamId.toString() !== teamId
      );

      // Save the changes
      await team.save();
      await program.save();

      res
        .status(200)
        .json({ message: "Team removed from program successfully!" });
    } catch (error) {
      console.error("Error deleting team from program:", error);
      res.status(500).json({ message: "Error deleting team from program." });
    }
  },

  getTeamProgramDetail: async (req, res) => {
    const { teamId, programId } = req.query; // Get teamId and programId from the query params

    console.log("req.q", req.query);
    console.log("team id", teamId);
    console.log("programId", programId);

    try {
      // Find the program by programId and look for the team in the teams array using dot notation
      const program = await Program.findOne(
        { _id: programId, "teams.teamId": teamId },
        { "teams.$": 1 } // Only return the matched team inside the teams array
      );

      console.log("pr", program);

      // If no matching program or team is found, return a 404 error
      if (!program || program.teams.length === 0) {
        return res
          .status(404)
          .json({ message: "Team not found in the program" });
      }

      // Return the found team's details
      const teamProgram = program.teams[0]; // Since we use "teams.$", only the matched team is returned in the array
      return res.status(200).json(teamProgram);
    } catch (error) {
      console.error("Error fetching team program details:", error);
      return res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  },

  getAllPrograms: async (req, res) => {
    try {
      const programs = await Program.find();

      res.json(programs);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteProgramById: async (req, res) => {
    try {
      const program = await Program.findById(req.params.id);
      if (!program) {
        return res.status(404).json({ message: "program not found" });
      }

      const imageUrl = program.image;

      // Delete the image file from the folder
      if (imageUrl) {
        const imagePath = path.join(
          __dirname,
          "../public/programImg",
          imageUrl
        );

        fs.unlinkSync(imagePath);
      }

      await program.deleteOne();

      res.status(200).json({ message: "program deleted successfully" });
    } catch (error) {
      console.error("Error deleting program:", error);
      res.status(500).json({ message: error.message });
    }
  },

  updateProgramById: async (req, res) => {
    const { value, label } = req.body;

    console.log(req.body);

    try {
      const foundProgram = await Program.findOne({ value: value });

      if (foundProgram) {
        foundProgram.value = value;
        foundProgram.label = label;

        await foundProgram.save();
        res.json(foundProgram);
      } else {
        res.status(404).json({ error: "Program Not Found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
