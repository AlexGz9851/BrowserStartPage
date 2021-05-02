import { useMutation, gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import GraphQLClient from '../../utils/GraphQLClient';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  IconButton, Button, Dialog, Divider, Input,
  Typography, InputLabel, FormControl, Select, TextField
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import { grey, indigo } from "@material-ui/core/colors";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import "./Settings.css"

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

function GoogleButton({ text, onClick }) {
  return (
    <div className="google-btn" onClick={onClick}>
      <div className="google-icon-wrapper">
        <img alt="Google Logo" className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
      </div>
      <div className="btn-text"><b>{text}</b></div>
    </div>
  )
}

function Settings({ settings, setSettings, setLoggedIn, imgUrl, openSettings, setOpenSettings, setGoogleLogedIn, googleLogedIn }) {
  const [updateSettings, { called, loading, data }] = useMutation(UPDATESETTINGS, {
    variables: { settings }
  });
  const [backUp, setBackUp] = useState({ ...settings })
  const [state, setState] = useState(settings.searchEngine);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [file, setFile] = useState("Choose a file");
  const [loadingBackdrop, setLoadingBackdrop] = useState(false);
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
    setOpenSettings(false);
    window.gapi.auth2.getAuthInstance().signOut();
    setGoogleLogedIn(false);
    localStorage.clear();
    GraphQLClient.clearStore();
  }

  const removeChanges = () => {
    setSettings({ ...backUp })
    handleClose()
  }

  const clickUpdateSettings = () => {
    setLoadingBackdrop(true)
    updateSettings().then(() => {
      setLoadingBackdrop(false)
      setOpenSettings(false);
    }).catch(err => {
      setLoadingBackdrop(false)
      setError(err)
    })
  }

  const handleClose = () => {
    setOpenSettings(false);
  };

  const handleChangeSelect = (event) => {
    setState(event.target.value);
    setSettings({ ...settings, searchEngine: event.target.value });
  };

  const iniciarSesion = () => {
    console.log("Iniciando sesion");
    window.gapi.auth2.getAuthInstance().signIn().then(() => {
      setGoogleLogedIn(true)
    });
  }

  const cerrarSesion = () => {
    console.log('Cerrando sesion');
    window.gapi.auth2.getAuthInstance().signOut();
    setOpenSettings(false);
    setGoogleLogedIn(false);
  }

  return (
    <div className="settings">
      <Backdrop open={loadingBackdrop} style={{ zIndex: 5000, color: '#fff' }}><CircularProgress /></Backdrop>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={openSettings}>
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
          <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
            <Input accept="image/*" id="contained-button-file" type="file" style={{ display: 'none' }}
              onChange={ev => {
                const formData = new FormData();
                formData.append("image", ev.target.files[0]);
                setFile(ev.target.files[0].name)
                fetch(imgUrl, { method: "POST", body: formData, headers: { "Authorization": "Bearer " + token } })
                  .then(res => res.json())
                  .then(data => {
                    setSettings({ ...settings, backgroundImage: data.id })
                  })
              }} />
            <TextField
              style={{ minWidth: 300 }}
              id="outlined-size-small"
              value={file}
              variant="outlined"
              size="small"
              disabled={true}
            />
            <Button variant="outlined">
              <label htmlFor="contained-button-file">Browse</label>
            </Button>
          </div>
          <Divider style={{ marginTop: 5 }} />

          <Typography gutterBottom style={{ color: 'black' }}>
            Connect with Google Calendar:
          </Typography>
          <div style={{ textAlign: "center" }}>
            {!googleLogedIn ?
              <GoogleButton text="Sync calendar!" onClick={iniciarSesion} />
              :
              <GoogleButton text="Disconnect :(" onClick={cerrarSesion} />
            }

          </div>
          <Divider style={{ margin: "5px 0" }} />
          <Typography gutterBottom style={{ color: 'black' }}>
            Your account:
          </Typography>
          <div style={{ textAlign: "center" }}>

            <Button onClick={logOut} color="secondary" variant="contained" >
              Log Out
          </Button>
          </div>
        </DialogContent>
        <DialogActions>

          <Button onClick={removeChanges} color="default" variant="contained">
            Cancel
          </Button>
          <Button onClick={clickUpdateSettings} color="primary" variant="contained" style={{ backgroundColor: indigo[400] }}>
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
      {error && error.graphQLErrors.concat(error.networkError).map(({ message }, i) => (
        <Snackbar key={i} open={showError} autoHideDuration={3000} onClose={() => { setShowError(false) }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert severity="error" onClose={() => { setShowError(false) }}>
            {message}
          </Alert>
        </Snackbar>
      ))
      }
    </div>
  );
}

export default Settings;
