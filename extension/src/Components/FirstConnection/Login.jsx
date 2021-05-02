import React, { useState, useEffect } from "react";
import { useLazyQuery, gql } from '@apollo/client';
import { Button, /*Divider,*/ TextField } from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorNotification from "../ErrorNotification/ErrorNotification";

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
  const [showError, setShowError] = useState(false);
  const [login, { called, error, loading, data }] = useLazyQuery(LOGIN);

  useEffect(() => {
    if (called && !loading && data && !error) {
      localStorage.setItem("token", data.login.jwt)
      localStorage.setItem("settings", JSON.stringify(data.login.user.settings))
      setLoggedIn(true)
      setSettings(data.login.user.settings)
    }
  }, [data, called, loading, error, setLoggedIn, setSettings])

  useEffect(() => {
    if (error) {
      setShowError(true)
    }
  }, [error])

  return (
    <div>
      {loading ? <CircularProgress style={{ marginBottom: "10px" }} /> :
        <div style={{ maxWidth: 345, textAlign: "center" }}>
          <div>
            <TextField
              id="standard-password-input"
              label="Username"
              style={{ marginBottom: 10 }}
              onChange={(ev) => setUsername(ev.target.value)}
              value={username}
            />
          </div>
          <div>
            <TextField
              id="standard-password-input"
              label="Password"
              type="password"
              onChange={(ev) => setPassword(ev.target.value)}
              value={password}
            />
          </div>
          <div>
            <Button variant="contained" style={{ marginBottom: 20, marginTop: 20 }} onClick={() => { login({ variables: { user: { username, password } } }) }}>
              <b>Login</b>
            </Button>
            {/* <Divider />
            <Button variant="contained" style={{ marginBottom: 20, marginTop: 20 }}>
              Google!
        </Button> */}
          </div>
          <ErrorNotification graphQLError={error} showError={showError} setShowError={setShowError} />
        </div>
      }


    </div>
  );
}

export default LogIn;
