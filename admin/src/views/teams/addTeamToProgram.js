import React, { useState, useEffect } from 'react'
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
  const [isSingle, setIsSingle] = useState(false)
  const [isGroup, setIsGroup] = useState(false)
  const [message, setMessage] = useState('')

  const [isEditMode, setIsEditMode] = useState(false) // Track whether we're editing or adding
  const [selectedProgramData, setSelectedProgramData] = useState(null) // Holds data of team in a program
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams()
    fetchPrograms()
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

  const fetchPrograms = async () => {
    try {
      const response = await axios.get(`${teamBaseUrl}/getAllPrograms`)

      if(!response.data || response.data.length === 0)
        {
          setPrograms([]);
          return;
        }else{
          setPrograms(response.data)
        }
      
    } catch (error) {
      console.error("Error fetching team data:", err);
      setError("Failed to load data. Please try again later."); // Set error message if fetching fails
    }finally{
      setLoading(false);
    }
  }

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
      const { score, rank, isSingle, isGroup } = response.data

      // Prepopulate form fields
      setScore(score)
      setRank(rank)
      setIsSingle(isSingle)
      setIsGroup(isGroup)
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
      isSingle,
      isGroup,
    };
  
    if (!isSingle && !isGroup) {
      Swal.fire({
        title: 'Error!',
        text: 'Please confirm single or group.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }
  
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
    setIsSingle(false)
    setIsGroup(false)
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
    disabled={loading} // Disable select if loading
  >
    <option value="" disabled>Select a team</option>

    {loading ? (
      // Show loading option while fetching data
      <option>Loading teams...</option>
    ) : teams.length === 0 ? (
      // Show no data available message if teams array is empty
      <option disabled>No teams available</option>
    ) : (
      // Render team options if data is available
      teams.map((team) => (
        <option key={team._id} value={team._id}>
          {team.name}
        </option>
      ))
    )}
  </select>
</div>

        <div className="form-group">
          <label className="label">Program</label>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            required
            className="input"
            disabled={loading}
          >
            <option value="" disabled>Select a program</option>
            {loading ? (
      // Show loading option while fetching data
      <option>Loading teams...</option>
    ) : programs.length === 0 ? (
      // Show no data available message if teams array is empty
      <option disabled>No programs available</option>
    ) : (
      // Render team options if data is available
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

       
        <div className="form-group">
  <label className="label">Team Type</label>
  <div className="checkbox-group">
    <label className="checkbox-label">
      <input
        type="checkbox"
        checked={isSingle}
        onChange={(e) => {
          setIsSingle(e.target.checked);
          if (e.target.checked) setIsGroup(false); // Uncheck the other checkbox
        }}
        className="checkbox"
      />
      Is Single
    </label>
    <label className="checkbox-label">
      <input
        type="checkbox"  
        checked={isGroup}
        onChange={(e) => {
          setIsGroup(e.target.checked);
          if (e.target.checked) setIsSingle(false); // Uncheck the other checkbox
        }}
        className="checkbox"
      />
      Is Group
    </label>
  </div>
</div>


        <button type="submit" className="btn">
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
  )
}

export default AddTeamToProgram
