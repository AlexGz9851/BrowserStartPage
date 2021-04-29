import { useMutation, gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import GraphQLClient from '../../utils/GraphQLClient';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  IconButton, Button, Dialog,
  Typography, InputLabel, FormControl, Select, TextField
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import { grey, indigo } from "@material-ui/core/colors";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const UPDATESETTINGS = gql`mutation updateSettings($settings: SettingsInput!){
  updateSettings(settings: $settings) {
    searchEngine,
    googleToken,
    backgroundImage
  }
}`


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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 400,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

function Settings({ settings, setSettings, setLoggedIn, imgUrl, open, setOpen }) {
  const [updateSettings, { called, loading, data }] = useMutation(UPDATESETTINGS, {
    variables: { settings }
  });
  const [backUp, setBackUp] = useState({ ...settings })
  const [state, setState] = useState(settings.searchEngine);
  const token = localStorage.getItem('token');
  const classes = useStyles();

  useEffect(() => {
    if (!loading && data && called) {
      localStorage.setItem("settings", JSON.stringify(data.updateSettings))
      setSettings(data.updateSettings)
      setBackUp(data.updateSettings)
    }
  }, [data, loading, called, backUp, setSettings])

  const logOut = () => {
    setLoggedIn(false);
    setSettings({});
    localStorage.clear();
    GraphQLClient.clearStore();
  }

  const removeChanges = () => {
    setSettings({ ...backUp })
  }

  const clickUpdateSettings = () => {
    updateSettings().catch(err => {
      return(
        <Snackbar open={true} autoHideDuration={3000} >
        <Alert severity="error">
          {err}
        </Alert>
      </Snackbar>
      )
    })
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeSelect = (event) => {
    setState(event.target.value);
    setSettings({ ...settings, searchEngine: event.target.value });
  };

  return (
    <div className="settings">
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle onClose={handleClose}>
          <Typography style={{ color: 'black' }} >
            Settings
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Typography style={{ color: 'black' }}>
            Select Search Engine:
          </Typography>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>Engine</InputLabel>
            <Select
              native
              value={state}
              onChange={handleChangeSelect}
              label="Engine"
              inputProps={{ name: 'engine', id: 'outlined-age-native-simple' }}
            >
              <option value={"GOOGLE"}>Google</option>
              <option value={"DUCKDUCKGO"}>Duck duck go</option>
              <option value={"YAHOO"}>Yahoo</option>
              <option value={"BING"}>Bing</option>
            </Select>
          </FormControl>
          <Typography style={{ color: 'black' }}>
            Change Background:
          </Typography>
          <div style={{ textAlign: 'center' }}>
            <TextField
              style={{ minWidth: 300 }}
              id="outlined-size-small"
              defaultValue="Choose Image"
              variant="outlined"
              size="small"
            />
            <Button variant="outlined" onChange={ev => {
              const formData = new FormData();
              formData.append("image", ev.target.files[0]);
              fetch(imgUrl, { method: "POST", body: formData, headers: { "Authorization": "Bearer " + token } })
                .then(res => res.json())
                .then(data => {
                  setSettings({ ...settings, backgroundImage: data.id })
                })
            }} >
              Browse
          </Button>
          </div>
          <Typography gutterBottom>
            Connect with Google:
          </Typography>
          <div style={{ textAlign: "center" }}>
            <Button variant="outlined">
              Google!
          </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={logOut} color="secondary" variant="contained" >
            Log Out
          </Button>
          <Button onClick={removeChanges} color="default" variant="contained">
            Cancel
          </Button>
          <Button onClick={clickUpdateSettings} color="primary" variant="contained" style={{ backgroundColor: indigo[400] }}>
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Settings;
