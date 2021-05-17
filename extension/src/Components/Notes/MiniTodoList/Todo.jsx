import React, { useState } from "react";
import Checkbox from '@material-ui/core/Checkbox';
import TextareaAutosize from 'react-textarea-autosize';
import './Todo.css';

function Todo(props) {
  const [todoContent, setTodoContent] = useState(props.content);
  const id = props.id;

  const todoStyle = props.style;
  const inputStyle = { ...todoStyle };
  inputStyle.width = (parseInt(inputStyle.width, 10) - 30) + "px";

  const handleChangeContent = (e) => {
    e.preventDefault();
    setTodoContent(e.target.value);
    if (typeof props.onChangeTodo !== 'undefined') {
      // TODO  que hacer en cambio de todo.
      props.onChangeTodo({ content: todoContent }, id);
    }
  };

  const handleDeleteElement = (e) => {
    e.preventDefault();
    if (typeof props.onRemove !== 'undefined') {
      props.onRemove(id);
    }
  }

  const onChangeContent = (e) => {
    e.preventDefault();
    setTodoContent(e.target.value);
  };



  return (
    <div id={id}
      className="todo"
      style={todoStyle}>
      <Checkbox
        checked={false}
        color="default"
        name="completed"
        onChange={handleDeleteElement}
      />
      {/* <input
        name="completed"
        type="checkbox"
        checked={false}
        onChange={handleDeleteElement} /> */}
      <TextareaAutosize className="todo-input"
        type="text"
        value={todoContent || ""}
        minRows={1}
        maxRows={50}
        placeholder='Add something to do!'
        style={inputStyle}
        onChange={onChangeContent}
        onBlur={handleChangeContent} />

    </div>
  );
}

export default Todo;