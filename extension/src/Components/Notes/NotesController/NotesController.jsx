import Note from '../Note'
import NoteForm from "../NoteForm"
import { useQuery, useMutation } from '@apollo/client';
import "./NotesController.css"
import { useState, useEffect } from 'react';
import { NOTES, FRAGMENT_NOTE_FIELDS, ADD_NOTE, UPDATE_NOTE, REMOVE_NOTE } from './NotesController.gql'

// const NoteTypes = { "TODO": "TODO", "NOTE": "NOTE" }

function NotesController() {
  const notesResponse = useQuery(NOTES);
  const [notes, setNotes] = useState(JSON.parse(localStorage.getItem('notes')) || [])
  const [addNote, addNoteResponse] = useMutation(ADD_NOTE, {
    update(cache, { data: { addNote } }) {
      cache.modify({
        fields: {
          notes(existingNotes = []) {
            const newNoteRef = cache.writeFragment({
              data: addNote,
              fragment: FRAGMENT_NOTE_FIELDS
            });
            return [...existingNotes, newNoteRef];
          }
        }
      })
    }
  });
  const [updateNote, updateNoteResponse] = useMutation(UPDATE_NOTE, {
    update(cache, { data: { updateNote } }) {
      cache.modify({
        fields: {
          notes(existingNotes = []) {
            const newNoteRef = cache.writeFragment({
              data: updateNote,
              fragment: FRAGMENT_NOTE_FIELDS
            });
            const filterNotes = existingNotes.filter(note => {
              const currId = note.__ref.split(":")[1]
              return currId !== updateNote._id
            })
            return [...filterNotes, newNoteRef];
          }
        }
      })
    }
  });
  const [removeNote, removeNoteResponse] = useMutation(REMOVE_NOTE, {
    update(cache, { data: { removeNote } }) {
      cache.modify({
        fields: {
          notes(existingNotes = []) {
            return existingNotes.filter(note => {
              const currId = note.__ref.split(":")[1]
              return currId !== removeNote._id
            });
          }
        }
      })
    }
  });

  useEffect(() => {
    if (notesResponse.data) {
      setNotes(notesResponse.data.notes)
      localStorage.setItem("notes", JSON.stringify(notesResponse.data.notes))
    }
  }, [notesResponse])

  const onAddNote = (n) => {
    addNote({ variables: { note: n } })
  };

  const onChangeNote = (currentNote) => {
    updateNote({ variables: { note: currentNote } })
  };

  const onRemoveNote = (_id) => {
    removeNote({ variables: { noteId: _id } })
  };

  return (
    <div>
      {(!notesResponse || notesResponse.loading) && "LOADING"}
      {notesResponse.error && "ERROR" + notesResponse.error}
      {addNoteResponse.error && "Error while adding"}
      {updateNoteResponse.error && "Error while adding"}
      {removeNoteResponse.error && "Error while adding"}
      <NoteForm onSubmit={onAddNote} />
      {notes.map(note => <Note note={note}
        onRemoveNote={onRemoveNote}
        onChangeNote={onChangeNote}
        key={note._id} />)}
    </div>
  );
}


export default NotesController;