import { createContext, useState } from 'react'
import axios from 'axios'
import { studentBaseUrl } from '../Constant/url'

export const CrudStudentContext = createContext()

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([])

  // Add a new student without program association
  const addStudent = async (student) => {
    
    try {
      const response = await axios.post(`${studentBaseUrl}/addStudent`, student)

      if (response.status === 200) {
        const newStudent = response.data
        setStudents((prevstudents) => [...prevstudents, newStudent])
      } else {
        throw new Error('Failed to add a new Student')
      }
    } catch (error) {
      console.error('Error adding Student:', error)
    }
  }

  // Fetch all students
  const fetchStudentData = async () => {
    console.log('fetchstudentData')
    try {
      const response = await axios.get(`${studentBaseUrl}/getAllStudents`)
      if (response.status !== 200) throw new Error('Failed to fetch students')

      //setStudentss(students)
      console.log('responsdata', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  // Edit student
  const editStudent = async (studentId, updatedData) => {
    try {
      const response = await axios.put(`${studentBaseUrl}/updateStudentBy/${studentId}`, updatedData)
      if (response.status === 200) {
        const updatedstudent = response.data
        setStudentss((prevstudents) =>
          prevstudents.map((student) => (student._id === updatedstudent._id ? updatedstudent : student)),
        )
      } else {
        throw new Error('Failed to update student')
      }
    } catch (error) {
      console.error('Error updating student:', error)
    }
  }

  // Delete student
  const deleteStudent = async (studentId) => {
    try {
      const response = await axios.delete(`${studentBaseUrl}/deleteStudentBy/${studentId}`)
      if (response.status === 200) {
        setStudentss((prevstudents) => prevstudents.filter((student) => student._id !== studentId))
      } else {
        throw new Error('Failed to delete student')
      }
    } catch (error) {
      console.error('Error deleting student:', error)
    }
  }

  const contextValue = {
    addStudent,
    students,
    fetchStudentData,
    editStudent,
    deleteStudent,
  }

  return <CrudStudentContext.Provider value={contextValue}>{children}</CrudStudentContext.Provider>
}
