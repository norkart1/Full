import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, Box, TextField, Button, Snackbar, Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Pagination } from '@mui/material';
import { CrudProgramContext } from '../../Context/programContext';
import Swal from 'sweetalert2'


const ProgramManagement = () => {
  const { fetchPrograms, createProgram, deleteProgramById } = useContext(CrudProgramContext);
  const [newProgram, setNewProgram] = useState('');
  const [isSingle, setIsSingle] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const [programType, setProgramType] = useState('');
  const [gender, setGender] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms,setFilteredPrograms] = useState([])
 

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const programsPerPage = 10;

  useEffect(() => {
    fetchPrograms()
      .then((data) => {
        setPrograms(data);
        setFilteredPrograms(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Something went wrong!");
        setOpenSnackbar(true);
        setLoading(false);
      });
  }, [fetchPrograms]);

  useEffect(() => {
    const filtered = programs.filter((program) =>
      program?.value.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPrograms(filtered);
  }, [searchTerm, programs]);

  const addProgram = () => {
    if (!newProgram || !programType || !gender) {
      setAlertMessage("All fields are required!");
      setOpenSnackbar(true);
      return;
    }

    if (!isSingle && !isGroup) {
      Swal.fire({
        title: 'Error!',
        text: 'Please confirm single or group.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }
  
    createProgram({  value: newProgram,
      isSingle: isSingle,
      isGroup: isGroup,
      gender: gender,
      type: programType
    })
      .then((newlyCreatedProgram) => {
        setPrograms((prev) => [...prev, newlyCreatedProgram]);
        setFilteredPrograms((prev) => [...prev, newlyCreatedProgram]);
        setNewProgram('');
        setAlertMessage('Program added successfully!');
        setOpenSnackbar(true);
      })
      .catch((error) => {
        
        if (error.response && error.response.status === 400) {
          setAlertMessage('Program already exists.');
        } else {
          setAlertMessage('Failed to add program.');
        }
  
        setOpenSnackbar(true);
      });
  };
  
  
  const handleDeleteProgram = (programId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProgramById(programId)
          .then((status) => {
            if(status === 200)
            {setPrograms((prev) => prev.filter((program) => program._id !== programId));
              setFilteredPrograms((prev) =>
                prev.filter((program) => program._id !== programId)
              );
              setOpenSnackbar(true);
              Swal.fire("Deleted!", "Your program has been deleted.", "success");}
          })
          .catch((error) => {
            console.error("Error deleting program:", error);
            setAlertMessage("Failed to delete program.");
            setOpenSnackbar(true);
          });
      }
    });
  };

  const indexOfLastProgram = currentPage * programsPerPage;
  const indexOfFirstProgram = indexOfLastProgram - programsPerPage;
  const currentPrograms = filteredPrograms?.slice(indexOfFirstProgram, indexOfLastProgram);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Program Management
      </Typography>

      {/* Add Program Form */}
      <Box display="flex" flexDirection="column" gap={2} mb={3}>
        <TextField
          value={newProgram}
          onChange={(e) => setNewProgram(e.target.value)}
          label="New Program"
          variant="outlined"
          fullWidth
          required
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isSingle}
              onChange={(e) => setIsSingle(e.target.checked)}
            />
          }
          label="Is Single"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isGroup}
              onChange={(e) => setIsGroup(e.target.checked)}
            />
          }
          label="Is Group"
        />
        <FormControl fullWidth required>
          <InputLabel>Type</InputLabel>
          <Select
            value={programType}
            onChange={(e) => setProgramType(e.target.value)}
            label="Type"
          >
            <MenuItem value="Kids">Kids</MenuItem>
            <MenuItem value="Sub-Junior">Sub-Junior</MenuItem>
            <MenuItem value="Junior">Junior</MenuItem>
            <MenuItem value="Senior">Senior</MenuItem>
            <MenuItem value="Super Senior">Super Senior</MenuItem>
            <MenuItem value="General">General</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth required>
          <InputLabel>Gender</InputLabel>
          <Select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            label="Gender"
          >
            <MenuItem value="Girl">Girl</MenuItem>
            <MenuItem value="Boy">Boy</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={addProgram}
          disabled={loading}
        >
          Add Program
        </Button>
      </Box>

      {/* Search Bar */}
      <TextField
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        label="Search Programs"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
      />

      {/* Snackbar for alerts */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="info" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      {/* Program Table */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Program Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Is Single</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Is Group</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Gender</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPrograms.map((program) => (
              <TableRow key={program._id}>
                <TableCell>{program.value}</TableCell>
                <TableCell>{program.isSingle ? 'Yes' : 'No'}</TableCell>
                <TableCell>{program.isGroup ? 'Yes' : 'No'}</TableCell>
                <TableCell>{program.type}</TableCell>
                <TableCell>{program.gender}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteProgram(program._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(currentPrograms.length / programsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        sx={{ display: 'flex', justifyContent: 'center' }}
      />
    </Container>
  );
};


export default ProgramManagement;
