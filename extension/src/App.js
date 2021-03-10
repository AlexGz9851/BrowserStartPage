import './App.css';
import Note from './Notes/Note.jsx'
import FirstConnection from './Components/FirstConnection/FirstConnection'
import { ApolloProvider } from '@apollo/client';
import GraphQLClient from './utils/GraphQLClient';
import { useState } from 'react';
import Settings from './Components/Settings/Settings';
import SearchEngine from './Components/SearchEngine/SearchEngine'

function App() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('token') != null);
  const [settings, setSettings] = useState(JSON.parse(localStorage.getItem('settings')) || {} );
  const [showSettings, setShowSettings] = useState(false);

  const style = {
    backgroundImage: settings.backgroundImage === "" ? "url(./defaultbg.jpeg)" : `url(${settings.backgroundImage})`
  }

  return (
    <ApolloProvider client={GraphQLClient}>
      {loggedIn ?
        <div className="App" style={style}>
          <a onClick={() => { setShowSettings(!showSettings) }}>SETTINGS</a>
          {showSettings ? <Settings settings={settings} setSettings={setSettings} setLoggedIn={setLoggedIn} /> : <></>}
          <SearchEngine searchEngine={settings.searchEngine} />
        </div> : <FirstConnection setLoggedIn={setLoggedIn} />}
    </ApolloProvider>
    
  );
}

export default App;