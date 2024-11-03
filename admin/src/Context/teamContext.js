import { createContext, useState } from 'react'
import axios from 'axios'
import { teamBaseUrl } from '../Constant/url'

export const CrudTeamContext = createContext()

export const CrudProvider = ({ children }) => {
  const [teams, setTeams] = useState([])

  // Add a new team without program association
  const addTeam = async (teamData) => {
    console.log('working')
    try {
      const response = await axios.post(`${teamBaseUrl}/addteam`, teamData)

      if (response.status === 200) {
        const newTeam = response.data
        setTeams((prevTeams) => [...prevTeams, newTeam])
      } else {
        throw new Error('Failed to add a new team')
      }
    } catch (error) {
      console.error('Error adding team:', error)
    }
  }

  // Fetch all teams
  const fetchTeamData = async () => {
    console.log('fetchTeamData')
    try {
      const response = await axios.get(`${teamBaseUrl}/getAllteams`)
      if (response.status !== 200) throw new Error('Failed to fetch teams')

      //setTeams(teams)
      console.log('responsdata', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching teams:', error)
    }
  }

  // Edit team
  const editTeam = async (teamId, updatedData) => {
    try {
      const response = await axios.put(`${teamBaseUrl}/updateteamBy/${teamId}`, updatedData)
      if (response.status === 200) {
        const updatedTeam = response.data
        setTeams((prevTeams) =>
          prevTeams.map((team) => (team._id === updatedTeam._id ? updatedTeam : team)),
        )
      } else {
        throw new Error('Failed to update team')
      }
    } catch (error) {
      console.error('Error updating team:', error)
    }
  }

  // Delete team
  const deleteTeam = async (teamId) => {
    try {
      const response = await axios.delete(`${teamBaseUrl}/deleteteamBy/${teamId}`)
      if (response.status === 200) {
        setTeams((prevTeams) => prevTeams.filter((team) => team._id !== teamId))
      } else {
        throw new Error('Failed to delete team')
      }
    } catch (error) {
      console.error('Error deleting team:', error)
    }
  }

  const contextValue = {
    addTeam,
    teams,
    fetchTeamData,
    editTeam,
    deleteTeam,
  }

  return <CrudTeamContext.Provider value={contextValue}>{children}</CrudTeamContext.Provider>
}
