import { useMutation, gql } from '@apollo/client';
import { useState, useEffect } from 'react';
import { Button, Divider, TextField } from "@material-ui/core";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SIGNUP = gql`mutation signUp($user: SignUpInput!){
  signUp(user: $user){
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

function SignUp({ setLoggedIn, setSettings }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //GRAPHQL
  const [signUp, { error, loading, data }] = useMutation(SIGNUP, {
    variables: { user: { username, password } }
  });

  const clickSignUp = () => {
    signUp().catch(err => {
          <Snackbar open={true} autoHideDuration={3000} >
            <Alert severity="error">
              {err}
            </Alert>
          </Snackbar>
    })
  }

  useEffect(() => {
    if (!loading && data) {
      localStorage.setItem("token", data.signUp.jwt)
      localStorage.setItem("settings", JSON.stringify(data.signUp.user.settings))
      setLoggedIn(true)
      setSettings(data.signUp.user.settings)
    }
  }, [data, loading, setLoggedIn, setSettings])

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
            <Button variant="contained" style={{ marginBottom: 20, marginTop: 20 }} onClick={clickSignUp}>
              Sign Up
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

export default SignUp;
