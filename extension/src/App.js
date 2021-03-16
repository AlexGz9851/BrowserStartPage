import './App.css';
import FirstConnection from './Components/FirstConnection/FirstConnection'
import { ApolloProvider } from '@apollo/client';
import GraphQLClient from './utils/GraphQLClient';
import { useState } from 'react';
import Settings from './Components/Settings/Settings';
import SearchEngine from './Components/SearchEngine/SearchEngine'
import NotesController from './Notes/NotesController';
import DateTimeClock from './Components/DateTime/DateTimeClock'

function App() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('token') != null);
  const [settings, setSettings] = useState(JSON.parse(localStorage.getItem('settings')) || {});
  const [showSettings, setShowSettings] = useState(false);

  const style = {
    backgroundImage: settings.backgroundImage === "" ? "url(./defaultbg.jpeg)" : `url(${settings.backgroundImage})`
  }

  const notes =[{ 
    id : "" + parseInt(Math.random()*100, 10),
    title : "Te quiero tanto",
    content :"Tanto como la caricia de la brisa en un nuevo dia",
    posX: "50px", 
    posY: "100px",
    isTodoList: false,
    todos: [],
}, {
  id : "" + parseInt(Math.random()*100, 10),
  title : "Supermercado",
  content :"Leche\nHuevos\nPan\nManzanas",
  posX: "300px", 
  posY: "200px",
  isTodoList: false,
  todos: [],
}, { 
  id : "" + parseInt(Math.random()*100, 10),
  title : "Te quiero tanto",
  content :"",
  posX: "200px", 
  posY: "300px",
  isTodoList: true,
  todos: [
    {id:"1001", content:"Sonia bonita"},
    {id:"222", content:"Tu amor por el mundo"},
    {id:"3333", content:"Se derrama hacia todos"},
    {id:"4443", content:"Y se vuelve fecundo"}
  ],
}];

  return (
    <ApolloProvider client={GraphQLClient}>
      {loggedIn ?
        <div className="App" style={style}>
          <NotesController savedNotes={notes}></NotesController>
          <a onClick={() => { setShowSettings(!showSettings) }}>SETTINGS</a>
          {showSettings ? <Settings settings={settings} setSettings={setSettings} setLoggedIn={setLoggedIn} /> : <></>}
          <DateTimeClock />
          <SearchEngine searchEngine={settings.searchEngine} />
        </div> : <FirstConnection setLoggedIn={setLoggedIn} />}
    </ApolloProvider>

  );
}

export default App;