import Note from '../Note'
import NoteForm from "../NoteForm"
import { useQuery, useMutation } from '@apollo/client';
import "./NotesController.css"
import { useState, useEffect, useCallback } from 'react';
import { NOTES, FRAGMENT_NOTE_FIELDS, ADD_NOTE, UPDATE_NOTE, REMOVE_NOTE } from './NotesController.gql'
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import ErrorNotification from '../../ErrorNotification/ErrorNotification';

function NotesController(props) {
  const notesResponse = useQuery(NOTES);
  const [notes, setNotes] = useState(JSON.parse(localStorage.getItem('notes')) || [])
  const [error, setError] = useState(null)
  const [errorOpen, setErrorOpen] = useState(false);
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

  useEffect(() => {
    if (notesResponse.error) {
      setError(notesResponse.error)
    }
    if (addNoteResponse.error) {
      setError(addNoteResponse.error)
    }
    if (updateNoteResponse.error) {
      setError(updateNoteResponse.error)
    }
    if (removeNoteResponse.error) {
      setError(removeNoteResponse.error)
    }
  }, [notesResponse.error, addNoteResponse.error, updateNoteResponse.error, removeNoteResponse.error])

  useEffect(() => {
    if (error) {
      setErrorOpen(true)
    }
  }, [error])

  const handleError = useCallback((err) => {
    setError(err);
  }, [setError])

  const onAddNote = (n) => {
    addNote({ variables: { note: n } }).catch(handleError)
  };

  const onChangeNote = useCallback((currentNote) => {
    updateNote({ variables: { note: currentNote } }).catch(handleError)
  }, [updateNote, handleError]);

  const onRemoveNote = (_id) => {
    removeNote({ variables: { noteId: _id } }).catch(handleError)
  };

  const updateNotes = (note, index, data) => {
    let noteCopy = { ...note, ...data }
    setNotes([...notes.slice(0, index), noteCopy, ...notes.slice(index + 1)])
  }


  return (
    <div style={{ width: "45%" }}>
      <Backdrop open={notesResponse?.loading} style={{ zIndex: 999, color: '#fff' }}><CircularProgress /></Backdrop>
      <ErrorNotification graphQLError={error} showError={errorOpen} setShowError={setErrorOpen} />
      <NoteForm onSubmit={onAddNote} setOpenSettings={props.setOpenSettings} />
      {notes.map((note, i) => <Note note={note}
        onRemoveNote={onRemoveNote}
        onChangeNote={onChangeNote}
        key={note._id}
        updateNote={(data) => { updateNotes(note, i, data) }} />)}
    </div>
  );
}


export default NotesController;