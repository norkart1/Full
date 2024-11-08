const Program = require("../Model/program");
const Teams = require("../Model/teams");
const path = require("path");
const fs = require("fs");

module.exports = {
  
  addProgram: async (req, res) => {
    const { value, isSingle, isGroup, gender, type } = req.body;

    console.log('values from client',req.body)
  
    // Validate the required fields
    if (!value || !gender || !type) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    // Validate gender and type to ensure they match the schema enums
    const validGenders = ['Girl', 'Boy'];
    const validTypes = ['Kids', 'Sub-Junior', 'Junior', 'Senior', 'Super Senior','General'];
  
    if (!validGenders.includes(gender)) {
      return res.status(400).json({ message: 'Invalid gender specified.' });
    }
  
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid program type specified.' });
    }
  
    try {
      // Check if the program already exists (case-insensitive)
      const existingProgram = await Program.findOne({
        value: { $regex: new RegExp(`^${value}$`, 'i') },
      });
  
      if (existingProgram) {
        return res.status(400).json({ message: 'Program already exists.' });
      }
  
      // Create the new program with validated fields
      const newProgram = new Program({ value, isSingle, isGroup, gender, type });
      await newProgram.save();
  
      return res.status(201).json(newProgram);
    } catch (error) {
      console.error('Error creating program:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  
  
  addTeamToProgram: async (req, res) => {
    try {
      const { teamId, programId, score, ageGroup } = req.body;

      console.log('add team to prog',req.body)
  
      // Find team and program by their IDs
      const team = await Teams.findById(teamId);
      const program = await Program.findById(programId);

      
      if (!team || !program) {
        return res.status(404).json({ message: "Team or Program not found." });
      }

      // Ensure the program type matches the age group
      if (program.type !== ageGroup) {
        return res.status(400).json({
        message: `Program does not belong to the selected age group (${ageGroup}).`,
        });
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
  
      // Replace 'program.teams' with 'program.participants'
const allTeamsInProgram = [...program.participants, { teamId, score }];
allTeamsInProgram.sort((a, b) => b.score - a.score);

const newRank = allTeamsInProgram.findIndex(
  (t) => t.teamId.toString() === teamId
) + 1;

// Add new participant to team and program
team.programs.push({ programId, score, rank: newRank });
program.participants.push({ teamId, score, rank: newRank });

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
      const { teamId, programId, score, ageGroup } = req.body;
  
      // Find the team and program by their IDs
      const team = await Teams.findById(teamId);
      const program = await Program.findById(programId);
  
      if (!team || !program) {
        return res.status(404).json({ message: "Team or Program not found." });
      }

      

if (program.type !== ageGroup) {
  return res.status(400).json({
    message: `Program does not belong to the selected age group (${ageGroup}).`,
  });
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
  
      // Update the score and other details for the team in the program
      teamParticipation.score = score;
      teamParticipation.isSingle = isSingle;
      teamParticipation.isGroup = isGroup;
  
      programParticipation.score = score;
      programParticipation.isSingle = isSingle;
      programParticipation.isGroup = isGroup;
  
      // Save the updated team and program
      await team.save();
      await program.save();
  
      // Recalculate the ranks for the program after the update
      const allTeamsInProgram = program.teams;
  
      // Sort teams by score in descending order and assign ranks
      allTeamsInProgram.sort((a, b) => b.score - a.score); // Sort by score descending
  
      // Update ranks for each team in the program
      for (let rank = 0; rank < allTeamsInProgram.length; rank++) {
        const teamInProgram = allTeamsInProgram[rank];
        teamInProgram.rank = rank + 1;  // Rank starts from 1
      }
  
      // Save the updated program after assigning ranks
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

  getProgramByAge:async(req,res)=>{
    try {
      const { ageGroup } = req.query;
  
      // Fetch programs where type matches the selected age group
      const programs = await Program.find({ type: ageGroup });
  
      if (!programs || programs.length === 0) {
        return res.status(404).json({ message: 'No programs found for the selected age group.' });
      }
  
      res.status(200).json(programs);
    } catch (error) {
      console.error('Error fetching programs by age group:', error);
      res.status(500).json({ message: 'Error fetching programs.' });
    }
  },

  getTeamProgramDetail: async (req, res) => {
    const { teamId, programId } = req.query; // Get teamId and programId from the query params
  
    try {
      // Find the program by programId and look for the team in the teams array using dot notation
      const program = await Program.findOne(
        { _id: programId, "teams.teamId": teamId },
        { "teams.$": 1 } // Only return the matched team inside the teams array
      );
  
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

  deleteProgram: async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find and delete the program
      const deletedProgram = await Program.findByIdAndDelete(id);
  
      if (!deletedProgram) {
        return res.status(404).json({ message: 'Program not found.' });
      }
  
      return res.status(200).json({ message: 'Program deleted successfully.' });
    } catch (error) {
      console.error('Error deleting program:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
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
