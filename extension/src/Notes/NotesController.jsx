import React, {useState} from "react";
import Note from './Note.jsx'
import NoteForm from "./NoteForm.jsx"
import  "./NotesController.css"

function NotesController(props){
    let startingNotes = (typeof props.savedNotes == 'undefined') ? [] : props.savedNotes;
    const [notes, setNotes] = useState(startingNotes);

    const submitCreateNote = (n) =>{
        //Function for submit to BD.
        // return note as object described below. 
        return {
            id : "" + parseInt(Math.random()*100, 10),
            title : n.title,
            content :"",
            posX: undefined, 
            posY: undefined,
        }
    }
    const submitUpdateNote = (n) =>{
        //Function for submit to BD.
    }

    const submitRemoveNote = (n) =>{
        //Function for submit to BD.
    }

    const onAddNote = (n) => {
        let newNote = submitCreateNote(n);
        let newNotes = [newNote, ...notes];
        setNotes(newNotes);
        console.log(newNotes)
    };

    const onChangeNote= (currentNote) =>{
        submitUpdateNote(currentNote);
        let remainingNotes = notes.filter((n)=> n.id !== currentNote.id);
        let newNotes = [currentNote, ...remainingNotes];
        setNotes(newNotes);
        console.log(newNotes)

        
    };

    const onRemoveNote = (id) =>{
        submitRemoveNote(id)
        let remainingNotes = notes.filter((n)=> n.id !== id);
        setNotes(remainingNotes);
        console.log(remainingNotes)
    };
    

    let defX = ""+(window.innerWidth- 300)+"px";
    const titleStyle = { left:defX, };

    return (
        <div>
            <h2 className="notes-title" style={titleStyle}>
            Add cute notes :3
            </h2>
            <NoteForm onSubmit={onAddNote}/>
            {notes.map((note) => (
                <Note id={note.id} title={note.title}
                key={note.id}
                content={note.content}  
                posX={note.posX}
                posY={note.posY}
                onRemove={onRemoveNote}  
                onChangeNote={onChangeNote}/>
            ))}
        </div>
    );
}


export default NotesController;