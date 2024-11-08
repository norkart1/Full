import React, { useState, useEffect } from 'react'
import { Container, Typography, TextField, Select, MenuItem, Button, CircularProgress, FormControl, InputLabel, FormHelperText } from '@mui/material';
import axios from 'axios'
import { teamBaseUrl } from '../../Constant/url'
import Swal from 'sweetalert2'
import './style.css'


const AddTeamToProgram = () => {
  const[error,setError] = useState(null);
  const [teams, setTeams] = useState([])
  const [programs, setPrograms] = useState([])
  const [selectedTeam, setSelectedTeam] = useState('')
  const [selectedProgram, setSelectedProgram] = useState('')
  const [score, setScore] = useState('')
  const [rank, setRank] = useState('')
  
  const [isGroup, setIsGroup] = useState(false)
  const [message, setMessage] = useState('')

  const [isEditMode, setIsEditMode] = useState(false) // Track whether we're editing or adding
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("");
  const [selectedProgramData, setSelectedProgramData] = useState(null) // Holds data of team in a program
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams()
    //fetchPrograms()
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${teamBaseUrl}/getAllteams`)

      if(!response.data || response.data.length === 0)
      {
        setTeams([]);
        return;
      }
      else{
        setTeams(response.data)
      }
      
    } catch (error) {
      console.error("Error fetching team data:", err);
      setError("Failed to load data. Please try again later."); // Set error message if fetching fails
    }finally{
      setLoading(false);
    }
  }



  const fetchProgramsByAgeGroup = async (ageGroup) => {
    setLoading(true);
    try {
      const response = await axios.get(`${teamBaseUrl}/getProgramsByAge`, {
        params: { ageGroup },
      });
      setPrograms(response.data); // Update state with fetched programs
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          const errorMessage = error.response.data.message || 'Bad Request';
          Swal.fire({
            title: 'Error!',
            text: errorMessage,
            icon: 'error',
            showConfirmButton: false, // Hide the "OK" button
            timer: 3000, // Auto-close after 3 seconds
            timerProgressBar: true, // Show a progress bar for the timer
          });
          setMessage(errorMessage);
        } else if (error.response.status === 404) {
          Swal.fire({
            title: 'Warning!',
            text: 'No programs found for the selected age group.',
            icon: 'warning',
            showConfirmButton: false, // Hide the "OK" button
            timer: 2000, // Auto-close after 2 seconds
            timerProgressBar: true, // Show a progress bar for the timer
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'There was a problem with your request.',
            icon: 'error',
            showConfirmButton: false, // Hide the "OK" button
            timer: 3000, // Auto-close after 3 seconds
            timerProgressBar: true, // Show a progress bar for the timer
          });
        }
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Network or Server error occurred.',
          icon: 'error',
          showConfirmButton: false, // Hide the "OK" button
          timer: 3000, // Auto-close after 3 seconds
          timerProgressBar: true, // Show a progress bar for the timer
        });
      }
    } finally {
      setLoading(false);
    }
  };

  
  const handleAgeGroupChange = (e) => {
    const ageGroup = e.target.value;
    setSelectedAgeGroup(ageGroup);
    fetchProgramsByAgeGroup(ageGroup); // Fetch programs when age group changes
  };

  // const fetchPrograms = async () => {
  //   try {
  //     const response = await axios.get(`${teamBaseUrl}/getAllPrograms`)

  //     if(!response.data || response.data.length === 0)
  //       {
  //         setPrograms([]);
  //         return;
  //       }else{
  //         setPrograms(response.data)
  //       }
      
  //   } catch (error) {
  //     console.error("Error fetching team data:", err);
  //     setError("Failed to load data. Please try again later."); // Set error message if fetching fails
  //   }finally{
  //     setLoading(false);
  //   }
  // }

  const fetchProgramDetails = async (teamId, programId) => {
    if (teamId === '' || programId === '') {
      Swal.fire({
        title: 'Error!',
        text: 'Please select Team & Program.',
        icon: 'error',
        confirmButtonText: 'OK',
      })
      return
    }

    try {
      const response = await axios.get(`${teamBaseUrl}/getTeamProgramDetails`, {
        params: { teamId, programId },
      })
      const { score, rank } = response.data

      // Prepopulate form fields
      setScore(score)
      setRank(rank)
        
      setIsEditMode(true) // Switch to edit mode
      setSelectedProgramData({ teamId, programId })
    } catch (error) {
      console.error('Error fetching team-program details:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Construct the request payload
    const payload = {
      teamId: selectedTeam,
      programId: selectedProgram,
      score: parseFloat(score), // Allows both integers and floats
      ageGroup: selectedAgeGroup,
    };
  
    try {
      let response;
  
      if (isEditMode) {
        // Edit mode - update existing entry
        response = await axios.put(`${teamBaseUrl}/editTeamInProgram`, payload);
        Swal.fire({
          title: 'Success!',
          text: 'Team details updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } else {
        // Add mode - create new entry
        response = await axios.post(`${teamBaseUrl}/addTeamToProgram`, payload);
        Swal.fire({
          title: 'Success!',
          text: 'Team added to program successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      }
  
      setMessage(response.data.message);
      resetForm(); // Reset the form after submitting
    } catch (error) {
      console.error('Error handling team in program:', error);
  
      // Handle specific errors based on response status
      if (error.response) {
        if (error.response.status === 400) {
          const errorMessage = error.response.data.message || 'Bad Request';
          Swal.fire({
            title: 'Error!',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'OK',
          });
          setMessage(errorMessage);
        } else if (error.response.status === 404) {
          Swal.fire({
            title: 'Error!',
            text: 'Team or Program not found.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'There was a problem with your request.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Network or Server error occurred.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
  
      setMessage('Error handling team in program.');
    }
  };
  

  const handleDelete = async () => {
    if (selectedTeam === '' || selectedProgram === '') {
      Swal.fire({
        title: 'Error!',
        text: 'Please select Team & Program.',
        icon: 'error',
        confirmButtonText: 'OK',
      })
      return
    }

    try {
      await axios.delete(`${teamBaseUrl}/deleteTeamFromProgram`, {
        data: { teamId: selectedTeam, programId: selectedProgram },
      })

      Swal.fire({
        title: 'Deleted!',
        text: 'Team successfully removed from the program.',
        icon: 'success',
        confirmButtonText: 'OK',
      })

      resetForm() // Reset the form after deleting
    } catch (error) {
      console.error('Error deleting team from program:', error)

      Swal.fire({
        title: 'Error!',
        text: 'There was a problem deleting the team from the program.',
        icon: 'error',
        confirmButtonText: 'OK',
      })
    }
  }

  const resetForm = () => {
    setSelectedTeam('')
    setSelectedProgram('')
    setScore('')
    setRank('')
   
    setIsEditMode(false)
    setMessage('')
  }

    

  return (
    <div className="container">
      <h2 className="title">Add Team to Program</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label">Team</label>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            required
            className="input"
            disabled={loading}
          >
            <option value="" disabled>Select a team</option>
            {loading ? (
              <option>Loading teams...</option>
            ) : teams.length === 0 ? (
              <option disabled>No teams available</option>
            ) : (
              teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))
            )}
          </select>
  
          <label className="label">Age Group</label>
          <select
            value={selectedAgeGroup}
            onChange={handleAgeGroupChange}
            required
            className="input"
            disabled={loading}
          >
            <option value="" disabled>Select Age Group</option>
            <option value="Kids">Kids</option>
            <option value="Sub-Junior">Sub-Junior</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
            <option value="Super Senior">Super Senior</option>
            <option value="General">General</option>
          </select>
  
          <label className="label">Program</label>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            required
            className="input"
            disabled={loading || !programs.length}
          >
            <option value="" disabled>Select a program</option>
            {loading ? (
              <option>Loading programs...</option>
            ) : programs.length === 0 ? (
              <option disabled>No programs available</option>
            ) : (
              programs.map((program) => (
                <option key={program._id} value={program._id}>
                  {program.value}
                </option>
              ))
            )}
          </select>
        </div>
  
        <div className="form-group">
          <label className="label">Score</label>
          <input
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            required
            min="0"
            step="0.01"
            className="input"
          />
        </div>
  
        <button type="submit" className="btn primary">
          Submit
        </button>
      </form>
  
      <div className="button-group">
        <button
          className="btn secondary"
          onClick={() => fetchProgramDetails(selectedTeam, selectedProgram)}
        >
          Edit Team Program Details
        </button>
        <button className="btn danger" onClick={handleDelete}>
          Delete Team from Program
        </button>
      </div>
    </div>
  );
  
}

export default AddTeamToProgram
