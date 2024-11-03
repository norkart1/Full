import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

const ConfirmationDialog = ({
  openConfirmation,
  setOpenConfirmation,
  action,
  franchiseData,
  setOpen,
}) => {
  const [superAdminPassword, setSuperAdminPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const handleClose = () => {
    setOpenConfirmation(false);
    setSuperAdminPassword("");
  };

  const handleConfirm = () => {
    // Perform validation of super admin password here
    // For example, you can check if the entered password matches the expected super admin password
    const expectedSuperAdminPassword = "password";
    if (superAdminPassword === expectedSuperAdminPassword) {
      action(franchiseData._id); // Proceed with the action if the password is valid
      setOpen(false);
      setOpenConfirmation(false);
    } else {
      // Handle incorrect password
      alert("Incorrect super admin password. Please try again.");
    }
  };

  const handleChange = (event) => {
    const inputPassword = event.target.value;
    setSuperAdminPassword(inputPassword);
    setIsPasswordValid(inputPassword === "password");
  };

  return (
    <Dialog open={openConfirmation} onClose={handleClose}>
      <DialogTitle style={{ backgroundColor: "#d73a49", color: "#fff" }}>Danger Zone</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This action is critical and irreversible. Please enter the super admin password to
          proceed.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="superAdminPassword"
          label="Super Admin Password"
          type="password"
          fullWidth
          value={superAdminPassword}
          onChange={handleChange}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          sx={{ backgroundColor: "#d73a49" }}
          variant="contained"
          disabled={!isPasswordValid}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
