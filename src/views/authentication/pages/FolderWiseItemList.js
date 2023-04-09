import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

import { useEffect } from "react";

import { Link, useParams } from "react-router-dom";

import { Edit, Delete, Visibility, VisibilityOff } from "@material-ui/icons";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Select,
  MenuItem,
  CircularProgress,
} from "@material-ui/core";
import EditModalComponent from "../component/EditModalComponent";

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

const FolderWiseItemList = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const superEmail = localStorage.getItem("super-email");
  const [userEmail, setUserEmail] = useState(superEmail);
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [arrowUp, setArrowUp] = useState(true);
  const [folderData, setFolderData] = useState([]);
  const [typeData, setTypeData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");

  const { itemName } = useParams();
  const [isLoading, setIsLoading] = useState();

  const handleEditClick = (itemId) => {
    setSelectedItemId(itemId);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const superEmail = localStorage.getItem("super-email");
    if (!superEmail) {
      window.location.href = "/";
    } else {
      async function fetchData() {
        setIsLoading(true);
        const result = await axios.post(
          "http://localhost:3001/api/users/get-folder-wise-item",
          {
            folder: itemName,
            superEmail: superEmail,
          }
        );
        console.log(result.data);
        setData(result.data);
        setIsLoading(false);
      }
      fetchData();
    }
  }, [itemName]);

  const onDelete = async (_id) => {
    alert("Do you really want to delete?");
    async function deleteData() {
      const result = await axios.post(
        "http://localhost:3001/api/users/delete-item-by-Folder",
        {
          id: _id,
          folder: itemName,
          superEmail: superEmail,
        }
      );
      if (result.status === 200) {
        setData(result.data);
        toast.success("Successfully deleted!");
      }
      setData(result.data);
    }
    deleteData();
  };

  const [sortDir, setSortDir] = useState("asc");
  const [sortCol, setSortCol] = useState(null);

  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }

    const sortedData = data.sort((a, b) => {
      if (sortDir === "asc") {
        return a[col] > b[col] ? 1 : -1;
      } else {
        return a[col] < b[col] ? 1 : -1;
      }
    });

    setData(sortedData);

    setArrowUp((prevState) => !prevState);
    console.log(arrowUp);
  };

  return (
    <div className={classes.root} style={{ marginLeft: "235px" }}>
      {isModalOpen && (
        <EditModalComponent item={selectedItemId} modalOpen={isModalOpen} />
      )}
      <h1>{itemName}</h1>
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#3F51B5" }}>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                #
              </TableCell>
              <TableCell
                onClick={() => handleSort("name")}
                style={{
                  cursor: "pointer",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Name
                {arrowUp ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
              </TableCell>
              <TableCell
                onClick={() => handleSort("username")}
                style={{
                  cursor: "pointer",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Username
                {arrowUp ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
              </TableCell>
              <TableCell
                onClick={() => handleSort("password")}
                style={{
                  cursor: "pointer",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Password
              </TableCell>
              <TableCell
                onClick={() => handleSort("url")}
                style={{
                  cursor: "pointer",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Url {arrowUp ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
              </TableCell>
              <TableCell
                onClick={() => handleSort("notes")}
                style={{
                  cursor: "pointer",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Notes {arrowUp ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
              </TableCell>
              <TableCell
                onClick={() => handleSort("type")}
                style={{
                  cursor: "pointer",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Type {arrowUp ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
              </TableCell>
              <TableCell
                onClick={() => handleSort("folder")}
                style={{
                  cursor: "pointer",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Folder {arrowUp ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          {data.length === 0 ? ( 
            isLoading ? ( 
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <p>No data to show</p>
                </TableCell>
              </TableRow>
            )
          ) : (
            data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.username}</TableCell>
                <TableCell>{item.password}</TableCell>
                <TableCell>
                  <a href={item.url}>{item.url}</a>
                </TableCell>
                <TableCell>{item.notes}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.folder.folderName}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(item._id)}>
                    <Edit />
                  </IconButton>

                  <IconButton
                    color="secondary"
                    onClick={() => onDelete(item.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </Table>
      </TableContainer>
    </div>
  );
};

export default FolderWiseItemList;
