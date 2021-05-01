import './App.css';
import FirstConnection from './Components/FirstConnection/FirstConnection'
import { ApolloProvider } from '@apollo/client';
import GraphQLClient from './utils/GraphQLClient';
import { useEffect, useState } from 'react';
import SearchEngine from './Components/SearchEngine/SearchEngine'
import NotesController from './Components/Notes/NotesController';
import DateTimeClock from './Components/DateTime/DateTimeClock';
import MyCalendar from './Components/MyCalendar/MyCalendar';
import Settings from './Components/Settings/Settings';
import { Grid, } from '@material-ui/core';

function App() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('token') != null);
  const [googleLogedIn, setGoogleLogedIn] = useState(false);
  const [events, setEvents] = useState([])
  const [settings, setSettings] = useState(JSON.parse(localStorage.getItem('settings')) || {});
  const [open, setOpen] = useState(false);

  const initClient = () => {
    window.gapi.client.init({
      apiKey: 'AIzaSyDZ6Xhd3wrHouKCBkmgtgRBnsYMGXLVW-I',
      clientId: '897082507710-h3ok2o6pt568cdpfi1lsfkhv930nhga0.apps.googleusercontent.com',
      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
      scope: "https://www.googleapis.com/auth/calendar.readonly"
    });
  }

  useEffect(() => {
    window.gapi.load('client:auth2', initClient);
  })

  useEffect(() => {
    if (googleLogedIn) {
      const date = new Date()
      date.setHours(0, 0, 0, 0)
      window.gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': date.toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
      }).then((response) => {

        var events = response.result.items;
        let dict = []

        for (let i = 0; i < events.length; i++) {
          let obj = {};
          let start_time = events[i]["start"]["dateTime"];
          let end_time = events[i]["end"]["dateTime"];
          if (!start_time) {
            start_time = events[i]["start"]["date"] + "T00:00:00-00:00"
            end_time = events[i]["start"]["date"] + "T23:59:59-00:00"
          }
          obj['title'] = events[i]["summary"];
          obj['start'] = start_time.substr(0, start_time.length - 6);
          obj['end'] = end_time.substr(0, end_time.length - 6);
          obj.id = i;
          obj.resourceId = 'r0'
          dict.push(obj)
        }
        setEvents(dict)
      });
    }
    else {
      setEvents([])
    }
  }, [googleLogedIn])

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
              <NotesController setOpenSettings={setOpen} />
            </Grid>
            <Grid style={{ marginTop: "5em" }}>
              <DateTimeClock />
            </Grid>
            <Grid style={{ marginTop: 30, marginBottom: 30 }}>
              <SearchEngine searchEngine={settings.searchEngine} />
            </Grid>
            <Grid style={{ bottom: "3%", position: "fixed", left: "10%" }}>
              <MyCalendar events={events} />
            </Grid>
          </Grid>
          <Settings settings={settings} setSettings={setSettings} setLoggedIn={setLoggedIn} imgUrl={imgUrl} open={open} setOpenSettings={setOpen} setGoogleLogedIn={setGoogleLogedIn} googleLogedIn={googleLogedIn} />
        </div> :
        <div className="App">
          <Grid container direction="column" style={{ paddingLeft: "40%", paddingTop: "10%" }}>
            <FirstConnection setLoggedIn={setLoggedIn} setSettings={setSettings} />
          </Grid>
        </div>
      }
    </ApolloProvider>
  );
}

export default App;