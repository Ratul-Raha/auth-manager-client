import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  makeStyles,
  TextField,
  Button,
  Grid,
  Paper,
  Select,
  MenuItem,
} from "@material-ui/core";
import axios from "axios";

import { ToastClassName, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    width: "60%",
    padding: theme.spacing(3),
  },
  input: {
    marginBottom: theme.spacing(3),
  },
  button: {
    marginRight: theme.spacing(2),
  },
}));

const EditCategoryWiseItem = () => {
  const { item } = useParams();
  const classes = useStyles();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [type, setType] = useState("");
  const [folder, setFolder] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    
    const superEmail = localStorage.getItem("super-email");
    if (!superEmail) {
      window.location.href = "https://authmanager-client.netlify.app/";
    }

    async function fetchData() {
      const result = await axios.post(
        "https://authmanager-server.onrender.com/api/users/get-category-wise-item-by-id",
        {
          item: item,
        }
      );
      console.log(result.data);

      const { name, password, url, type, folder, username, notes } =
        result.data;
      setName(name);
      setUsername(username);
      setPassword(password);
      setUrl(url);
      setNotes(notes);
      setType(type);
      setFolder(folder);
    }
    fetchData();
  }, [item]);

  const handleUpdate = () => {
    const updatedItem = {
      name,
      username,
      password,
      url,
      notes,
      type,
      folder,
    };

    async function updateData() {
      setButtonDisabled(true);
      const result = await axios.post(
        "http://authmanager-server.onrender.com/api/users/update-category-wise-item",
        {
          updatedItem: updatedItem,
          id: item,
        }
      );
      if (result.status === 200) {
        setButtonDisabled(false);
        toast.success("Successfully updated Item");
        console.log(result.data);
      }
    }
    updateData();
  };

  return (
    <Paper className={classes.root}>
      <ToastContainer />
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={classes.input}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className={classes.input}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={classes.input}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Url"
            variant="outlined"
            fullWidth
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            className={classes.input}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Notes"
            variant="outlined"
            fullWidth
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className={classes.input}
          />
        </Grid>
        <Grid item>
          <Select
            label="Type"
            variant="outlined"
            fullWidth
            value={type}
            onChange={(event) => setType(event.target.value)}
            className={classes.input}
          >
            <MenuItem value="Social">Social</MenuItem>
            <MenuItem value="Official">Official</MenuItem>
          </Select>
        </Grid>
        <Grid item>
          <Select
            label="Type"
            variant="outlined"
            fullWidth
            value={folder}
            onChange={(event) => setFolder(event.target.value)}
            className={classes.input}
          >
            <MenuItem value="Folder1">Folder 1</MenuItem>
            <MenuItem value="Folder2">Folder 2</MenuItem>
          </Select>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            className={classes.button}
            disabled={buttonDisabled}
          >
            Update
          </Button>
          <Button variant="contained" color="secondary">
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default EditCategoryWiseItem;
