import { useMutation, gql } from '@apollo/client';
import { useState, useEffect } from 'react';
import { Button, /*Divider,*/ TextField } from "@material-ui/core";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

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
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);

  //GRAPHQL
  const [signUp, { error: signUpError, loading, data }] = useMutation(SIGNUP, {
    variables: { user: { username, password } }
  });

  const clickSignUp = () => {
    signUp().catch(err => {
      setError(err);
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

  useEffect(() => {
    if (signUpError) {
      setError(signUpError)
      setShowError(true)
    }
  }, [signUpError])

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
            <Button variant="contained" style={{ marginBottom: 20, marginTop: 20 }} onClick={clickSignUp}>
              <b>Sign Up</b>
            </Button>
            {/* <Divider />
            <Button variant="contained" style={{ marginBottom: 20, marginTop: 20 }}>
              Google!
            </Button> */}
          </div>
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
      }

    </div>
  );
}

export default SignUp;
