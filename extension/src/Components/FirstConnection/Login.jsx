import { useLazyQuery, gql } from '@apollo/client';
import { useState, useEffect } from 'react';

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
  const [login, { called, error, loading, data }] = useLazyQuery(LOGIN)

  useEffect(() => {
    if (called && !loading && data && !error) {
      localStorage.setItem("token", data.login.jwt)
      localStorage.setItem("settings", JSON.stringify(data.login.user.settings))
      setLoggedIn(true)
      setSettings(data.login.user.settings)
    }
  }, [data, called, loading, error, setLoggedIn, setSettings])

  return (
    <div className="login">
      {error ? <>{error.message}</> : <></>} {/*TODO(LALO): Esto como una notificacion bonita*/}
      {loading ? "..." : <div>
        <input type="text" name="user" value={username} onChange={(ev) => setUsername(ev.target.value)} />
        <input type="password" name="password" value={password} onChange={(ev) => setPassword(ev.target.value)} />
        <input type="button" value="login" onClick={() => {
          login({
            variables: { user: { username, password } }
          })
        }} />
      </div>
      }

    </div>
  );
}

export default LogIn;
