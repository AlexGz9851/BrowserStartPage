import { gql } from '@apollo/client'

export const FRAGMENT_NOTE_FIELDS = gql`
fragment NoteFields on Note {
  title,
  _id,
  type,
  content,
  posX, posY,
  width,
  todo {content, done}
}`

export const NOTES = gql`${FRAGMENT_NOTE_FIELDS}
query { 
  notes{
    ...NoteFields
  }
}`

export const REMOVE_NOTE = gql`mutation removeNote($noteId: String!) {
  removeNote(noteId: $noteId) {
      _id
  }
}`

export const ADD_NOTE = gql`${FRAGMENT_NOTE_FIELDS}
mutation addNote($note: NoteInput!) {
  addNote(note: $note) {
    ...NoteFields
  }
}`

export const UPDATE_NOTE = gql`${FRAGMENT_NOTE_FIELDS}
mutation updateNote($note: NoteInput!) {
  updateNote(note: $note) {
    ...NoteFields
  }
}`