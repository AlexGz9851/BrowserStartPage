import './App.css';
import FirstConnection from './Components/FirstConnection/FirstConnection'
import { ApolloProvider } from '@apollo/client';
import GraphQLClient from './utils/GraphQLClient';
import { useState } from 'react';
import SearchEngine from './Components/SearchEngine/SearchEngine'
import NotesController from './Components/Notes/NotesController';
import DateTimeClock from './Components/DateTime/DateTimeClock';
import MyCalendar from './Components/MyCalendar/MyCalendar';
import { Grid, } from '@material-ui/core';

function App() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('token') != null);
  const [settings, setSettings] = useState(JSON.parse(localStorage.getItem('settings')) || {});

  const uri = process.env.NODE_ENV === "production" ? process.env.REACT_APP_PRODUCTION_SERVER : process.env.REACT_APP_DEVELOPMENT_SERVER;
  const imgUrl = `${uri}filemanager/`;
  const style = {
    backgroundImage: `url(${imgUrl}${settings.backgroundImage}), url(./defaultbg.jpeg)`
  }

  return (
    <ApolloProvider client={GraphQLClient}>
      {loggedIn ?
        <div className="App" style={style}>
          <Grid direction="column">
            <Grid container justify="flex-end">
              <NotesController />
            </Grid>
            <Grid style={{ marginTop: 25 }}>
              <DateTimeClock />
            </Grid>
            <Grid style={{ marginTop: 30, marginBottom: 30 }}>
              <SearchEngine searchEngine={settings.searchEngine} />
            </Grid>
            <Grid style={{ marginTop: "10%" }}>
              <MyCalendar />
            </Grid>
          </Grid>
        </div> :
        <Grid container direction="column" style={{textAlign:"center"}}>
          <Grid container justify="center">
            <FirstConnection setLoggedIn={setLoggedIn} setSettings={setSettings} />
          </Grid>
        </Grid>

      }
    </ApolloProvider>
  );
}

export default App;