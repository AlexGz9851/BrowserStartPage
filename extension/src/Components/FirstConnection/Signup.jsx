import { useMutation, gql } from '@apollo/client';
import { useState } from 'react';

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

function SignUp({ setLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //GRAPHQL
  const [signUp, { error, loading, data }] = useMutation(SIGNUP, {
    variables: { user: { username, password } }
  });

  if (!loading && data) {
    localStorage.setItem("token", data.signUp.jwt)
    localStorage.setItem("settings", JSON.stringify(data.signUp.user.settings))
    setLoggedIn(true)
  }

  return (
    <div className="signup">
      {error ? <>{error.message}</> : <></>}
      {loading ? "..." : <div>
        <input type="text" name="user" value={username} onChange={(ev) => setUsername(ev.target.value)} />
        <input type="text" name="password" value={password} onChange={(ev) => setPassword(ev.target.value)} />
        <input type="button" value="signup" onClick={signUp} />
      </div>
      }

    </div>
  );
}

export default SignUp;
