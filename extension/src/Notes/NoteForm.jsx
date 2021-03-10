import React, {useState} from "react";
import './NoteForm.css';


function NoteForm(props){
    const [input, setInput] = useState('');

    const handleChange = e => {
        setInput(e.target.value);
    };

    const handleSubmit = e => {
        e.preventDefault();
    
        props.onSubmit({
          title: input,
        });
        setInput('');
    };

    return (
        <form onSubmit={handleSubmit} className='todo-form'>
            <>
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
            </>
        </form>
      );
}

export default NoteForm;