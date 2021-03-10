import logo from './logo.svg';
import './App.css';
import Note from './Notes/Note.jsx'

let text = "Hacer esta libreria de notas!"; 
function coolFunction(id){
  console.log("HOLA"+ id);
}
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Note id='1' title='Tarea cool!' content='Lavar ropa'  posX='300px' onRemove={(e,a) =>coolFunction(e, a)}/>
        <Note id='2' title='Tarea Web' content={text}  posX='100px' posY='260px' onRemove={(e,a) =>coolFunction(e, a)}/>
        <Note id='3' title='Tarea cool!' content='Lavar ropa' onRemove={(e,a) =>coolFunction(e, a)}  />
        <Note id='5' title='Tarea cool!' content='Lavar ropa' onRemove={(e,a) =>coolFunction(e, a)}   />
        <Note id='6' title='Tarea cool!' content='Lavar ropa' onRemove={(e,a) =>coolFunction(e, a)}  />
        <Note id='7' title='Tarea cool!' content='Lavar ropa' onRemove={(e,a) =>coolFunction(e, a)}   />
        <Note id='8' title='Tarea cool!' content='Lavar ropa' onRemove={(e,a) =>coolFunction(e, a)}  />
        <Note id='4' title='Frase del dia' content='te quiero mucho bb porque el deseo del alma es soportar un poco mas'  posX='100px' onRemove={(e,a) =>coolFunction(e, a)}/>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
