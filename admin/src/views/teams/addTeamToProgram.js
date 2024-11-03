import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { teamBaseUrl } from '../../Constant/url'
import Swal from 'sweetalert2'
import './style.css'

const AddTeamToProgram = () => {
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

  useEffect(() => {
    fetchTeams()
    fetchPrograms()
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${teamBaseUrl}/getAllteams`)
      setTeams(response.data)
    } catch (error) {
      console.error('Error fetching teams:', error)
    }
  }

  const fetchPrograms = async () => {
    try {
      const response = await axios.get(`${teamBaseUrl}/getAllPrograms`)
      setPrograms(response.data)
    } catch (error) {
      console.error('Error fetching programs:', error)
    }
  }

  const fetchProgramDetails = async (teamId, programId) => {
    if (teamId === '' || programId === '') {
      Swal.fire({
        title: 'Error!',
        text: 'Please select TeamId & ProgramId.',
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
    e.preventDefault()

    // Construct the request payload
    const payload = {
      teamId: selectedTeam,
      programId: selectedProgram,
      score: parseFloat(score), // Allows both integers and floats
      rank: parseInt(rank), // Keeps rank as an integer
      isSingle,
      isGroup,
    }

    // try {
    //   const response = await axios.post(`${teamBaseUrl}/addTeamToProgram`, payload)

    //   // If successful, show success alert
    //   Swal.fire({
    //     title: 'Success!',
    //     text: 'Team added to program successfully!',
    //     icon: 'success',
    //     confirmButtonText: 'OK',
    //   })

    //   setMessage(response.data.message)
    //   setScore('')
    //   setIsGroup(false)
    //   setIsSingle(false)
    //   setScore('')
    //   setRank('')
    // } catch (error) {
    //   console.error('Error adding team to program:', error)
    //   setMessage('Error adding team to program.')

    //   // If error occurs, show error alert
    //   Swal.fire({
    //     title: 'Error!',
    //     text: 'There was a problem adding the team to the program.',
    //     icon: 'error',
    //     confirmButtonText: 'OK',
    //   })
    // }

    try {
      if (isEditMode) {
        // Edit mode - update existing entry
        const response = await axios.put(`${teamBaseUrl}/editTeamInProgram`, payload)

        Swal.fire({
          title: 'Success!',
          text: 'Team details updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        })
      } else {
        // Add mode - create new entry
        const response = await axios.post(`${teamBaseUrl}/addTeamToProgram`, payload)

        Swal.fire({
          title: 'Success!',
          text: 'Team added to program successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        })
        setMessage(response.data.message)
      }

      resetForm() // Reset the form after submitting
    } catch (error) {
      console.error('Error handling team in program:', error)
      setMessage('Error handling team in program.')

      Swal.fire({
        title: 'Error!',
        text: 'There was a problem with your request.',
        icon: 'error',
        confirmButtonText: 'OK',
      })
    }
  }

  const handleDelete = async () => {
    if (selectedTeam === '' || selectedProgram === '') {
      Swal.fire({
        title: 'Error!',
        text: 'Please select TeamId & ProgramId.',
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

  // const containerStyle = {
  //   maxWidth: '600px',
  //   margin: '50px auto',
  //   padding: '20px',
  //   border: '1px solid #ddd',
  //   borderRadius: '8px',
  //   backgroundColor: '#f9f9f9',
  //   boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  // }

  // const formGroupStyle = {
  //   marginBottom: '15px',
  // }

  // const labelStyle = {
  //   display: 'block',
  //   fontSize: '16px',
  //   fontWeight: '500',
  //   marginBottom: '8px',
  // }

  // const inputStyle = {
  //   width: '100%',
  //   padding: '10px',
  //   fontSize: '16px',
  //   border: '1px solid #ccc',
  //   borderRadius: '4px',
  //   boxSizing: 'border-box',
  // }

  // const checkboxStyle = {
  //   marginRight: '10px',
  // }

  // const buttonStyle = {
  //   width: '100%',
  //   padding: '12px',
  //   backgroundColor: '#4CAF50',
  //   color: 'white',
  //   fontSize: '16px',
  //   fontWeight: 'bold',
  //   border: 'none',
  //   borderRadius: '4px',
  //   cursor: 'pointer',
  //   transition: 'background-color 0.3s',
  // }

  // const buttonHoverStyle = {
  //   backgroundColor: '#45a049',
  // }

  // const messageStyle = {
  //   marginTop: '20px',
  //   fontSize: '16px',
  //   fontWeight: 'bold',
  //   color: message.includes('Error') ? 'red' : 'green',
  // }

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
          >
            <option value="">Select a team</option>
            {teams?.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="label">Program</label>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            required
            className="input"
          >
            <option value="">Select a program</option>
            {programs?.map((program) => (
              <option key={program._id} value={program._id}>
                {program.label}
              </option>
            ))}
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
          <label className="label">Rank</label>
          <input
            type="number"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            required
            min="0"
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
                onChange={(e) => setIsSingle(e.target.checked)}
                className="checkbox"
              />
              Is Single
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isGroup}
                onChange={(e) => setIsGroup(e.target.checked)}
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

      {message && <p className="message">{message}</p>}
    </div>
  )
}

export default AddTeamToProgram
