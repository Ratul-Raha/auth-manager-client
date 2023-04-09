import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Modal,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  TextareaAutosize,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import ExportIcon from "@material-ui/icons/GetApp";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import CircularProgress from "@material-ui/core/CircularProgress";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useEffect } from "react";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { Link, useParams } from "react-router-dom";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
const useStyles = makeStyles((theme) => ({
  root: {
    flexDirection: "column",
    alignItems: "center",
    height: "90vh",
    background: "#f1f1f1",
    padding: "25px",
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
  const [isLoading, setIsLoading] = useState(true);
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

  const [data, setData] = useState([]);
  const [folders, setFolders] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [itemModalOpen, setItemModalOpen] = useState(false);

  const itemClick = async (id) => {
    setSelectedItem(id);
    const result = await axios.post(
      "http://localhost:3001/api/users/get-single-item",
      {
        id: id,
      }
    );
    setSelectedItem(result.data);
    setItemModalOpen(true);
  };

  useEffect(() => {
    const superEmail = localStorage.getItem("super-email");
    if (!superEmail) {
      window.location.href = "/";
    } else {
      async function fetchData() {
        const result = await axios.post(
          "http://localhost:3001/api/users/get-all-items",
          {
            folder: "Folder2",
            superEmail: superEmail,
          }
        );
        console.log(result.data);
        setData(result.data);
        setIsLoading(false);
      }
      fetchData();
      async function fetchFolder() {
        const folders = await axios.post(
          "http://localhost:3001/api/users/get-folder",
          {
            userEmail: userEmail,
          }
        );
        setFolders(folders.data.folders);
      }
      fetchFolder();
    }
  }, []);

  const handleExportCsv = () => {
    const csv = convertToCsv(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const filename = "data.csv";
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert("Your browser does not support downloading CSV files.");
      }
    }
  };

  const convertToCsv = (data) => {
    const header = ["Name", "Username", "Password", "URL", "Notes", "Type"];
    const rows = data.map((item) => [
      item.name,
      item.username,
      showPassword ? item.password : item.password.replace(/./g, "*"),
      item.url,
      item.notes,
      item.type,
    ]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    return csv;
  };

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
      .post(`http://localhost:3001/api/users/add-item`, formData)
      .then((response) => {
        console.log(response);
        toast.success("Successfully added");
        handleClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCopyPassword = (password) => {
    navigator.clipboard.writeText(password);
    toast.success("Password copied to clipboard!");
  };

  async function onDelete() {}

  return (
    <div className={classes.root} style={{ marginLeft: "235px" }}>
      <ToastContainer />
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        className={classes.button}
        onClick={handleOpen}
      >
        Add item
      </Button>
      <Button
        variant="contained"
        color="primary"
        startIcon={<ExportIcon />}
        className={classes.button}
        onClick={handleExportCsv}
        style={{ backgroundColor: "#8DB600", color: "#FFFFFF" }}
      >
        Export as CSV
      </Button>
      {isLoading ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            marginTop: "10px",
          }}
        >
          {data.map((item, index) => (
            <div
              key={item.id}
              style={{
                width: "calc(25% - 15px)",
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                padding: "20px",
                boxSizing: "border-box",
                cursor: "pointer",
              }}
              onClick={() => itemClick(item._id)}
            >
              <div style={{ display: "flex", marginBottom: "10px" }}>
                <div style={{ fontWeight: "bold", marginRight: "10px" }}>
                  Name:
                </div>
                <div>{item.name}</div>
              </div>
              <div style={{ display: "flex", marginBottom: "10px" }}>
                <div style={{ fontWeight: "bold", marginRight: "10px" }}>
                  Username:
                </div>
                <div>{item.username}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Link to={{ pathname: `/edit-item/${item._id}` }}>
                  <IconButton size="small">
                    <EditIcon />
                  </IconButton>
                </Link>
                <IconButton
                  size="small"
                  onClick={() => {
                    onDelete(item._id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={itemModalOpen} onClose={() => setItemModalOpen(false)}>
        <div className={classes.paper}>
          <Typography
            variant="h5"
            style={{ marginBottom: "10px", paddingTop: "10px" }}
          >
            Item Details
          </Typography>
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <div
              style={{ fontWeight: "bold", marginRight: "10px", color: "gray" }}
            >
              Name:
            </div>
            <div>{selectedItem?.name}</div>
          </div>
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <div
              style={{ fontWeight: "bold", marginRight: "10px", color: "gray" }}
            >
              Username:
            </div>
            <div>{selectedItem?.username}</div>
          </div>
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <div
              style={{ fontWeight: "bold", marginRight: "10px", color: "gray" }}
            >
              Password:
            </div>
            <div>
              {showPassword ? selectedItem?.password : "*********"}
              <IconButton
                size="small"
                aria-label="Toggle password visibility"
                title={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <VisibilityOffIcon style={{ fontSize: "18px" }} />
                ) : (
                  <VisibilityIcon style={{ fontSize: "18px" }} />
                )}
              </IconButton>
              <IconButton
                size="small"
                aria-label="Copy password"
                title="Copy password"
                onClick={() => handleCopyPassword(selectedItem?.password)}
              >
                <FileCopyIcon style={{ fontSize: "18px" }} />
              </IconButton>
            </div>
          </div>
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <div
              style={{ fontWeight: "bold", marginRight: "10px", color: "gray" }}
            >
              URL:
            </div>
            <div>{selectedItem?.url}</div>
          </div>
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <div
              style={{ fontWeight: "bold", marginRight: "10px", color: "gray" }}
            >
              Category:
            </div>
            <div>{selectedItem?.type}</div>
          </div>
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <div
              style={{ fontWeight: "bold", marginRight: "10px", color: "gray" }}
            >
              Folder:
            </div>
            <div>{selectedItem?.folder}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Link to={{ pathname: `/edit-item/${selectedItem?._id}` }}>
              <IconButton size="small">
                <EditIcon />
              </IconButton>
            </Link>
            <IconButton
              size="small"
              onClick={() => {
                onDelete(selectedItem?._id);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      </Modal>

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
                {folders.map((folder) => (
                  <MenuItem key={folder.id} value={folder.folderName}>
                    {folder.folderName}
                  </MenuItem>
                ))}
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
