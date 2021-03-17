import React, { useState } from "react";
import './NoteForm.css';


function NoteForm(props) {
  const NoteTypes = { "TODO": "TODO", "NOTE": "NOTE" }
  const [input, setInput] = useState('');
  const [noteType, setNoteType] = useState(false);

  const handleChange = e => {
    setInput(e.target.value);
  };

  const handleSubmit = e => {
    props.onSubmit({
      title: input,
      type: (noteType ? NoteTypes.TODO : NoteTypes.NOTE),
    });
    setInput('');
    setNoteType(false);
  };

  const handleCheckbox = e => {
    setNoteType(e.target.checked);
  };

  return (
    <div className='todo-form'>
      <input
        name="isTodoList"
        type="checkbox"
        checked={noteType}
        onChange={handleCheckbox} />
      <input
        placeholder='Add new Note'
        value={input}
        onChange={handleChange}
        name='text'
        className='todo-input'
      />
      <button onClick={handleSubmit} className='todo-button'>
        Add Note!
              </button>
    </div>

  );
}

export default NoteForm;