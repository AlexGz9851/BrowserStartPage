import logo from './logo.svg';
import './App.css';
import FirstConnection from './Components/FirstConnection/FirstConnection'
import { ApolloProvider } from '@apollo/client';
import GraphQLClient from './utils/GraphQLClient';
import { useState } from 'react';

function App() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('token') != null);
  const logOut = () => {
    localStorage.clear();
    GraphQLClient.resetStore();
    setLoggedIn(false);
  }
  return (
    <ApolloProvider client={GraphQLClient}>
      {loggedIn ?
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
      </p>
            <a onClick={logOut} href="#">LOGOUT</a>
          </header>
        </div> : <FirstConnection setLoggedIn={setLoggedIn} />}
    </ApolloProvider>
  );
}

export default App;
