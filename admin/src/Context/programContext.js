import { createContext, useState } from 'react'
import axios from 'axios'
import { teamBaseUrl } from '../Constant/url'

export const CrudProgramContext = createContext()

export const ProgramCrudProvider = ({ children }) => {
  const [programs, setPrograms] = useState([])

  // Create a new program
  const createProgram = async (programData) => {
    console.log('cre',programData)
    try {
      const response = await axios.post(`${teamBaseUrl}/createProgram`, programData, {
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.status === 201) {
        const newProgram = response.data
        setPrograms((prevPrograms) => [...prevPrograms, newProgram])
      } else {
        throw new Error('Failed to add new program')
      }
    } catch (error) {
      console.error('Error adding program:', error)
    }
  }

  // Fetch all programs
  const fetchPrograms = async () => {
    try {
      const response = await axios.get(`${teamBaseUrl}/getAllPrograms`)
      if (response.status !== 200) throw new Error('Failed to fetch programs')

      return response.data
    } catch (error) {
      console.error('Error fetching programs:', error)
    }
  }

  // Edit program
  const editProgram = async (programId, updatedData) => {
    try {
      const response = await axios.put(`${teamBaseUrl}/programs/update/${programId}`, updatedData)
      if (response.status === 200) {
        const updatedProgram = response.data
        setPrograms((prevPrograms) =>
          prevPrograms.map((program) =>
            program._id === updatedProgram._id ? updatedProgram : program,
          ),
        )
      } else {
        throw new Error('Failed to update program')
      }
    } catch (error) {
      console.error('Error updating program:', error)
    }
  }

  // Delete program
  const deleteProgramById = async (programId) => {
    try {
      const response = await axios.delete(`${teamBaseUrl}/deleteProgramById/${programId}`)
      if (response.status === 200) {
        setPrograms((prevPrograms) => prevPrograms.filter((program) => program._id !== programId))
      } else {
        throw new Error('Failed to delete program')
      }
    } catch (error) {
      console.error('Error deleting program:', error)
    }
  }

  const contextValue = {
    createProgram,
    programs,
    fetchPrograms,
    editProgram,
    deleteProgramById,
  }

  return <CrudProgramContext.Provider value={contextValue}>{children}</CrudProgramContext.Provider>
}
