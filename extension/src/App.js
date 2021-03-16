import './App.css';
import FirstConnection from './Components/FirstConnection/FirstConnection'
import { ApolloProvider } from '@apollo/client';
import GraphQLClient from './utils/GraphQLClient';
import { useState } from 'react';
import Settings from './Components/Settings/Settings';
import SearchEngine from './Components/SearchEngine/SearchEngine'
import NotesController from './Components/Notes/NotesController';
import DateTimeClock from './Components/DateTime/DateTimeClock'

function App() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('token') != null);
  const [settings, setSettings] = useState(JSON.parse(localStorage.getItem('settings')) || {});
  const [showSettings, setShowSettings] = useState(false);

  const uri = process.env.NODE_ENV === "production" ? process.env.REACT_APP_PRODUCTION_SERVER : process.env.REACT_APP_DEVELOPMENT_SERVER;
  const imgUrl = `${uri}filemanager/`;
  const style = {
    backgroundImage: `url(${imgUrl}${settings.backgroundImage}), url(./defaultbg.jpeg)`
  }

  return (
    <ApolloProvider client={GraphQLClient}>
      {loggedIn ?
        <div className="App" style={style}>
          <NotesController />
          <span onClick={() => { setShowSettings(!showSettings) }} style={{ cursor: 'pointer', color: "blue" }}>SETTINGS</span>
          {showSettings ? <Settings settings={settings} setSettings={setSettings} setLoggedIn={setLoggedIn} imgUrl={imgUrl} /> : <></>}
          <DateTimeClock />
          <SearchEngine searchEngine={settings.searchEngine} />
        </div> : <FirstConnection setLoggedIn={setLoggedIn} setSettings={setSettings} />}
    </ApolloProvider>

  );
}

export default App;