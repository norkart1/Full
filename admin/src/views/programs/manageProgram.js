import React, { useState, useContext, useEffect } from 'react'
import { CrudProgramContext } from '../../Context/programContext'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

const ProgramManagement = () => {
  const { createProgram, fetchPrograms, deleteProgramById } = useContext(CrudProgramContext)

  const [newProgram, setNewProgram] = useState('') // State for new program input
  const [searchTerm, setSearchTerm] = useState('') // State for search term
  const [allPrograms, setAllPrograms] = useState([]) // State for storing all fetched programs
  const [openSnackbar, setOpenSnackbar] = useState(false) // Snackbar state
  const [alertMessage, setAlertMessage] = useState('') // Snackbar alert message

  // Fetch programs on component mount
  useEffect(() => {
    fetchPrograms()
      .then((data) => setAllPrograms(data))
      .catch((error) => console.error('Error fetching programs:', error))
  }, [fetchPrograms])

  // Function to add a new program
  const addProgram = () => {
    if (!newProgram) {
      setAlertMessage('Please enter a program name.')
      setOpenSnackbar(true)
      return
    }

    createProgram({ value: newProgram, label: newProgram }) // Call createProgram from context
      .then(() => {
        setNewProgram('') // Reset input field
        setAlertMessage('Program added successfully!')
        setOpenSnackbar(true)
        window.location.href = '/'
      })
      .catch((error) => {
        console.error('Error adding program:', error)
        setAlertMessage('Failed to add program.')
        setOpenSnackbar(true)
      })
  }

  // Function to delete a program
  const handleDeleteProgram = (programId) => {
    deleteProgramById(programId)
      .then(() => {
        setAlertMessage('Program deleted successfully!')
        setOpenSnackbar(true)
      })
      .catch((error) => {
        console.error('Error deleting program:', error)
        setAlertMessage('Failed to delete program.')
        setOpenSnackbar(true)
      })
  }

  // Filter programs based on search term
  const filteredPrograms = allPrograms.filter((program) =>
    program.label.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h1
        style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '24px',
        }}
      >
        Program Management
      </h1>

      {/* Search Bar */}
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', width: '50%' }}>
        <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={searchTerm}
            style={{
              width: '100%',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              outline: 'none',
              fontSize: '16px',
            }}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search programs"
          />
        </div>
      </div>

      {/* Snackbar for alerts */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="warning" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      {/* Add New Program Form */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ marginBottom: '16px' }}>
          <input
            name="program"
            type="text"
            value={newProgram}
            onChange={(e) => setNewProgram(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              outline: 'none',
              fontSize: '16px',
            }}
            placeholder="New program"
          />
        </div>

        <button
          onClick={addProgram}
          style={{
            fontSize: '16px',
            fontWeight: '500',
            padding: '12px 16px',
            width: '100%',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#007bff')}
        >
          Add Program
        </button>
      </div>

      {/* Program List */}
      <div style={{ marginBottom: '32px' }}>
        {filteredPrograms?.map((program) => (
          <div
            key={program._id}
            style={{
              backgroundColor: '#fff',
              padding: '24px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              marginBottom: '32px',
              transition: 'box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)')
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)')}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#333',
                }}
              >
                {program.label}
              </span>

              <button
                onClick={() => handleDeleteProgram(program._id)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#c82333')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = '#dc3545')}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProgramManagement
