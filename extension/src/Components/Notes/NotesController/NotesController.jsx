import Note from '../Note'
import NoteForm from "../NoteForm"
import { useQuery, useMutation } from '@apollo/client';
import "./NotesController.css"
import { useState, useEffect } from 'react';
import { NOTES, FRAGMENT_NOTE_FIELDS, ADD_NOTE, UPDATE_NOTE, REMOVE_NOTE } from './NotesController.gql'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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

  const handleError = (err) => {
    if (err.networkError?.result?.errors?.length > 0) {
      err = err.networkError.result.errors[0]
    }
    return (
      <Snackbar open={true} autoHideDuration={3000} >
        <Alert severity="error">
          {err.message}
        </Alert>
      </Snackbar>
    )
  }

  const onAddNote = (n) => {
    addNote({ variables: { note: n } }).catch(handleError)
  };

  const onChangeNote = (currentNote) => {
    updateNote({ variables: { note: currentNote } }).catch(handleError)
  };

  const onRemoveNote = (_id) => {
    removeNote({ variables: { noteId: _id } }).catch(handleError)
  };

  const updateNotes = (note, index, data) => {
    let noteCopy = { ...note, ...data }
    setNotes([...notes.slice(0, index), noteCopy, ...notes.slice(index + 1)])
  }
  return (
    <div>
      {(!notesResponse || notesResponse.loading) && <CircularProgress />}
      {notesResponse.error &&
        <Snackbar open={true} autoHideDuration={3000} >
          <Alert severity="error">
            ERROR + {notesResponse.error}
          </Alert>
        </Snackbar>
      }
      {addNoteResponse.error &&
        <Snackbar open={true} autoHideDuration={3000} >
          <Alert severity="error">
            Error while adding
          </Alert>
        </Snackbar>
      }
      {updateNoteResponse.error &&
        <Snackbar open={true} autoHideDuration={3000} >
          <Alert severity="error">
            Error while adding
          </Alert>
        </Snackbar>
      }
      {removeNoteResponse.error &&
        <Snackbar open={true} autoHideDuration={3000} >
          <Alert severity="error">
            Error while adding
          </Alert>
        </Snackbar>
      }
      <NoteForm onSubmit={onAddNote} />
      {notes.map((note, i) => <Note note={note}
        onRemoveNote={onRemoveNote}
        onChangeNote={onChangeNote}
        key={note._id}
        updateNote={(data) => { updateNotes(note, i, data) }} />)}
    </div>
  );
}


export default NotesController;