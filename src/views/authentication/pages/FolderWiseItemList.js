import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

import { useEffect } from "react";

import { Link, useParams } from "react-router-dom";

import { Button, Table, Modal, Form } from "react-bootstrap";

import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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

const FolderWiseItemList = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const superEmail = localStorage.getItem("super-email");
  const [userEmail, setUserEmail] = useState(superEmail);
  const [data, setData] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null);

  const { itemName } = useParams();

  useEffect(() => {
    const superEmail = localStorage.getItem("super-email");

    if (!superEmail) {
      window.location.href = "https://authmanager-client.netlify.app/";
    } else {
      async function fetchData() {
        const result = await axios.post(
          "https://authmanager-server.onrender.com/api/users/get-folder-wise-item",
          {
            folder: itemName,
            superEmail: superEmail,
          }
        );
        console.log(result.data);
        setData(result.data);
      }
      fetchData();
    }
  }, []);

  const onDelete = async (_id) => {
    alert("Do you really want to delete?");
    async function deleteData() {
      const result = await axios.post(
        "https://authmanager-server.onrender.com/api/users/delete-item-by-Folder",
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

  return (
    <div className={classes.root}>
      <h1>{itemName}</h1>
      <Table
        striped
        bordered
        hover
        responsive
        style={{ border: "1px solid black", width: "100%" }}
      >
        <thead style={{ backgroundColor: "#3F51B5", color: "white" }}>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Username</th>
            <th>Password</th>
            <th>Url</th>
            <th>Notes</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id} style={{ border: "1px solid black" }}>
              <td style={{ border: "1px solid black" }}>{index + 1}</td>
              <td style={{ border: "1px solid black" }}>{item.name}</td>
              <td style={{ border: "1px solid black" }}>{item.username}</td>
              <td style={{ border: "1px solid black" }}>
                {" "}
                {showPassword
                  ? item.password
                  : item.password.replace(/./g, "*")}
                <IconButton
                  size="small"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </td>
              <td style={{ border: "1px solid black" }}>{item.url}</td>
              <td style={{ border: "1px solid black" }}>{item.notes}</td>
              <td style={{ border: "1px solid black" }}>{item.type}</td>
              <td style={{ border: "1px solid black" }}>
                <Link
                  to={{
                    pathname: `/edit-category-wise-item/${item._id}`,
                  }}
                >
                  <Button variant="primary" size="sm" className="mr-2">
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(item._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default FolderWiseItemList;
