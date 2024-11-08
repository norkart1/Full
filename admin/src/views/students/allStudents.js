import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Paper } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import Swal from 'sweetalert2';
import axios from 'axios';

function StudentTable({ students, onEdit, onDelete }) {
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/students/${id}`);
        Swal.fire('Deleted!', 'Student has been deleted.', 'success');
        onDelete();
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete student.', 'error');
      }
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Age Group</TableCell>
            <TableCell>Team</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student._id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.age}</TableCell>
              <TableCell>{student.ageGroup}</TableCell>
              <TableCell>{student.team?.name || 'N/A'}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => onEdit(student)} color="primary">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(student._id)} color="secondary">
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default StudentTable;
