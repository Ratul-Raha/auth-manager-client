import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import { Link } from "react-router-dom";

import DashboardIcon from "@material-ui/icons/Dashboard";
import FolderIcon from "@material-ui/icons/Folder";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const Sidebar = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClick2 = () => {
    setOpen2(!open2);
  };

  const handleItemClick = (itemName) => {
    window.location.href = `/category-wise-item-list/${itemName}`;
  };

  const handleItemClick2 = (itemName) => {
    window.location.href = `/folder-wise-item-list/${itemName}`;
  };

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar} />
      <List>
        <ListItem button component={Link} to="/dashboard">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={handleClick}>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary="Folders" />
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              className={classes.nested}
              style={{ paddingLeft: 80 }}
            >
              <ArrowRightAltIcon />
              <ListItemText
                primary="Folder 1"
                onClick={() => handleItemClick2("Folder1")}
              />
            </ListItem>
            <ListItem
              button
              className={classes.nested}
              style={{ paddingLeft: 80 }}
            >
              <ArrowRightAltIcon />
              <ListItemText
                primary="Folder 2"
                onClick={() => handleItemClick2("Folder2")}
              />
            </ListItem>
          </List>
        </Collapse>
        <ListItem button onClick={handleClick2}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Items" />
          {open2 ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
        <Collapse in={open2} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              className={classes.nested}
              style={{ paddingLeft: 80 }}
            >
              <ArrowRightAltIcon />
              <ListItemText
                primary="Social"
                onClick={() => handleItemClick("Social")}
              />
            </ListItem>
            <ListItem
              button
              className={classes.nested}
              style={{ paddingLeft: 80 }}
            >
              <ArrowRightAltIcon />
              <ListItemText
                primary="Official"
                onClick={() => handleItemClick("Official")}
              />
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
};

export default Sidebar;
