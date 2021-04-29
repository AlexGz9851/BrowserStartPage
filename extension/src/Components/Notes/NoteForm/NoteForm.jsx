import React, { useState } from "react";
import './NoteForm.css';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, InputBase, Divider, IconButton } from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import Settings from '../../Settings/Settings';
import { grey, } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
    backgroundColor: grey[900]
  },
  input: {
    color: 'white',
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
    backgroundColor: 'white'
  },
}));

function NoteForm(props) {
  const NoteTypes = { "TODO": "TODO", "NOTE": "NOTE" }
  const [input, setInput] = useState('');
  const [settings, setSettings] = useState(JSON.parse(localStorage.getItem('settings')) || {});
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('token') != null);
  const [open, setOpen] = useState(false);

  const classes = useStyles();

  const uri = process.env.NODE_ENV === "production" ? process.env.REACT_APP_PRODUCTION_SERVER : process.env.REACT_APP_DEVELOPMENT_SERVER;
  const imgUrl = `${uri}filemanager/`;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleChange = e => {
    setInput(e.target.value);
  };

  const handleSubmitTODO = () => {
    props.onSubmit({
      title: input,
      type: (NoteTypes.TODO),
    });
    setInput('');
  };

  const handleSubmitNote = () => {
    props.onSubmit({
      title: input,
      type: (NoteTypes.NOTE),
    });
    setInput('');
  };

  return (
    <div className='todo-form'>
      <Paper className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder="Add new note..."
          onChange={handleChange}
        />
        <IconButton style={{ color: 'white' }} className={classes.iconButton} onClick={handleSubmitNote}>
          <EditOutlinedIcon />
        </IconButton>
        <IconButton style={{ color: 'white' }} className={classes.iconButton} onClick={handleSubmitTODO}>
          <AssignmentTurnedInOutlinedIcon />
        </IconButton>
        <Divider className={classes.divider} orientation="vertical" />
        <IconButton style={{ color: 'white' }} className={classes.iconButton} onClick={handleClickOpen}>
          <SettingsOutlinedIcon />
        </IconButton>
      </Paper>
      <Settings settings={settings} setSettings={setSettings} setLoggedIn={setLoggedIn} imgUrl={imgUrl} open={open} setOpen={setOpen} />
    </div>

  );
}

export default NoteForm;