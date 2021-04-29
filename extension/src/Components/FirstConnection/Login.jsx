import React, { useState, useEffect } from "react";
import { useLazyQuery, gql } from '@apollo/client';
import { Button, Divider, TextField } from "@material-ui/core";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const LOGIN = gql`query login($user: LoginInput!){
  login(user: $user) {
    user{
      settings {
        searchEngine,
        googleToken,
        backgroundImage
      }
    },
    jwt
  }
}`

function LogIn({ setLoggedIn, setSettings }) {
  const [username, setUsername] = useState("test");
  const [password, setPassword] = useState("test");
  const [login, { called, error, loading, data }] = useLazyQuery(LOGIN);

  useEffect(() => {
    if (called && !loading && data && !error) {
      localStorage.setItem("token", data.login.jwt)
      localStorage.setItem("settings", JSON.stringify(data.login.user.settings))
      setLoggedIn(true)
      setSettings(data.login.user.settings)
    }
  }, [data, called, loading, error, setLoggedIn, setSettings])

  return (
    <div>
      {loading ? "..." :
        <div style={{ maxWidth: 345, textAlign: "center" }}>
          <TextField
            id="standard-password-input"
            label="Username"
            style={{ marginBottom: 10 }}
            onChange={(ev) => setUsername(ev.target.value)}
            value={username}
          />
          <TextField
            id="standard-password-input"
            label="Password"
            type="password"
            onChange={(ev) => setPassword(ev.target.value)}
            value={password}
          />
          <div>
            <Button variant="contained" style={{ marginBottom: 20, marginTop: 20 }} onClick={() => { login({ variables: { user: { username, password } } }) }}>
              Login
        </Button>
            <Divider />
            <Button variant="contained" style={{ marginBottom: 20, marginTop: 20 }}>
              Google!
        </Button>
          </div>
          {error ?
            <Snackbar open={error} autoHideDuration={3000} >
              <Alert severity="error">
                {error.message}
              </Alert>
            </Snackbar>
            : null}
        </div>
      }


    </div>
  );
}

export default LogIn;
