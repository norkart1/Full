import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Snackbar, Alert, Pagination,Box ,TextField} from '@mui/material';
import { CrudProgramContext } from '../../Context/programContext';
import Swal from 'sweetalert2'


const ProgramManagement = () => {
  const { fetchPrograms, createProgram, deleteProgramById } = useContext(CrudProgramContext);
  const [newProgram, setNewProgram] = useState("");
  const [programs, setPrograms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const programsPerPage = 5;

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
    if (!newProgram.trim()) {
      setAlertMessage('Please enter a program name.');
      setOpenSnackbar(true);
      return;
    }
  
    createProgram({ value: newProgram, label: newProgram })
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
      <Box display="flex" gap={2} mb={3}>
        <TextField
          value={newProgram}
          onChange={(e) => setNewProgram(e.target.value)}
          label="New Program"
          variant="outlined"
          fullWidth
        />
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
        <Alert onClose={() => setOpenSnackbar(false)} severity="info" sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      {/* Program Table */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Program Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPrograms.map((program) => (
              <TableRow key={program._id}>
                <TableCell>{program.value}</TableCell>
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
        count={Math.ceil(filteredPrograms.length / programsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        sx={{ display: "flex", justifyContent: "center" }}
      />
    </Container>
  );
};


export default ProgramManagement;
