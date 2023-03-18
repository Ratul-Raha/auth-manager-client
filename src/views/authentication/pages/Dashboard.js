import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Fab,
  Typography,
  Modal,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  TextareaAutosize,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import axios from "axios";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#f1f1f1",
  },
  fab: {
    margin: theme.spacing(1),
  },
  text: {
    margin: theme.spacing(1),
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    margin: theme.spacing(1),
    width: "100%",
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const userEmail = localStorage.getItem("super-email");

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    url: "",
    password: "",
    notes: "",
    type: "",
    folder: "",
    userEmail: userEmail,
  });

  useEffect(() => {
    const superEmail = localStorage.getItem("super-email");
    if (!superEmail) {
      window.location.href = "/";
    }
  }, []);

  const generatePassword = () => {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    setShowPassword(!showPassword);
    return password;
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleGeneratePassword = () => {
    setFormData({ ...formData, password: generatePassword() });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    axios
      .post(`https://authmanager-server.onrender.com/api/users/add-item`, formData)
      .then((response) => {
        console.log(response);
        toast.success("Successfully added");
        handleClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={classes.root}>
      <ToastContainer />
      <Fab
        color="primary"
        aria-label="add"
        className={classes.fab}
        onClick={handleOpen}
      >
        <AddIcon />
      </Fab>
      <Typography variant="h5" className={classes.text}>
        Add Item
      </Typography>
      <Modal open={open} onClose={handleClose}>
        <div className={classes.paper}>
          <Typography variant="h5">Add Item</Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <FormControl variant="outlined" className={classes.input}>
              <InputLabel id="category-label">Credential Type</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Category"
              >
                <MenuItem value="Social">Social</MenuItem>
                <MenuItem value="Official">Official</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Name"
              variant="outlined"
              className={classes.input}
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              label="Username"
              variant="outlined"
              className={classes.input}
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              type={showPassword ? "text" : "password"}
              label="Password"
              variant="outlined"
              className={classes.input}
              name="password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={handleGeneratePassword}
            >
              Generate Password
            </Button>
            <TextField
              label="URL"
              variant="outlined"
              className={classes.input}
              name="url"
              value={formData.url}
              onChange={handleChange}
            />
            <TextareaAutosize
              aria-label="notes"
              placeholder="Notes"
              rowsMin={3}
              className={classes.input}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
            <FormControl variant="outlined" className={classes.input}>
              <InputLabel id="category-label">Select Folder</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="folder"
                value={formData.folder}
                onChange={handleChange}
                label="Category"
              >
                <MenuItem value="Folder1">Folder 1</MenuItem>
                <MenuItem value="Folder2">Folder 2</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Submit
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
