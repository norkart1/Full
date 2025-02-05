// AddBrokerForm.js
import React, { useContext, useState, useEffect } from 'react'
import {
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  FormControl,
  FormControlLabel,
  Checkbox,
  InputLabel,
  Select,
  FormLabel,
  FormGroup,
  MenuItem,
} from '@mui/material'
import { CrudTeamContext } from '../../Context/teamContext'
import { CrudProgramContext } from '../../Context/programContext'

const AddStudent = ({ open, setOpen }) => {
  const { addTeam } = useContext(CrudTeamContext)
  // const { fetchPrograms } = useContext(CrudProgramContext)

  const [imagePreview, setImagePreview] = useState(null)
  const [nameError, setNameError] = useState('')

  // const [loading,setLoading] = useState(true);
  // const [error,setError] = useState(null)
  

  const [formData, setFormData] = useState({
    name: '',
    image: null,
    imagePreviewUrl: '',
  })

  // const [allPrograms, setAllPrograms] = useState([])

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const fetchedData = await fetchPrograms()
      
//         if (!fetchedData) {
//           throw new Error("No data available");
//         }

//         setAllPrograms(fetchedData)
        
//       } catch (error) {
//         console.error("Error fetching team data:", err);
//         setError(error.message);
//       }finally{
// setLoading(false)
//       }
//     }
//     fetchData()
//   }, [fetchPrograms])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value, // Handle NaN by setting empty string
    })

    // Validate input value after each change
    validateName(value)
  }

  const handleBlur = (e) => {
    const { name, value } = e.target

    // Reset corresponding error when the user types
    switch (name) {
      case 'name':
        if (!value.trim()) {
          setNameError('Student name is required')
        }
        break

      default:
        break
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    const maxSizeInBytes = 2 * 1024 * 1024 // 2MB (adjust as needed)
    if (file.size > maxSizeInBytes) {
      alert('File size exceeds the maximum allowed limit (2MB). Please select a smaller file.')
    } else {
      setFormData({ ...formData, image: file })

      // Display image preview
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const isNameValid = validateName(formData.name)
    // const isRankingValid = validateRanking(formData.ranking)

    // const isScoreValid = validateScore(formData.score)

    if (!isNameValid || formData.image === null) {
      alert('Image not found');
      return
    }

    try {
      const formDataToSend = new FormData()
      for (let key in formData) {
        formDataToSend.append(key, formData[key])
      }

      await addTeam(formDataToSend)

      // Reset form after submission
      setFormData({
        name: '',

        imagePreviewUrl: '',
        image: null,
      })

      setImagePreview(null)
      setOpen(false)
    } catch (error) {
      console.error('Error adding Student:', error)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',

      imagePreviewUrl: '',
      image: null,
    })
    setImagePreview(null)
    setOpen(false)
  }

  //validation setup here;

  const validateName = (name) => {
    if (!name.trim()) {
      setNameError('Name is required')
      return false
    }
    setNameError('')
    return true
  }

  return (
    <div>
      <Dialog open={open}>
        <DialogContent>
          {/* Edit form section */}
          <Typography variant="h6" gutterBottom>
            Add Student
          </Typography>
          <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Student Name"
                  name="name"
                  variant="outlined"
                  margin="normal"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Typography color="error" variant="body2">
                  {nameError}
                </Typography>
              </Grid>

               

              {/* Image Upload */}
              <Grid item xs={12}>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  id="upload-image"
                />
                <label htmlFor="upload-image">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Upload Image
                  </Button>
                </label>
              </Grid>

              {imagePreview && (
                <Grid item xs={12}>
                  <Box mt={2}>
                    <Typography variant="subtitle1">Uploaded Image Preview:</Typography>
                    <img
                      src={imagePreview}
                      alt="Uploaded"
                      style={{ maxWidth: '50%', maxHeight: '50%', height: 'auto', marginTop: 8 }}
                    />
                  </Box>
                </Grid>
              )}

              {/* Submit / Cancel Buttons */}
              <Grid item xs={12}>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button type="submit" color="primary">
                    Save Changes
                  </Button>
                </DialogActions>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddStudent
