import React, { useState } from "react";
import './MiniTodoList.css';
import Todo from './Todo.jsx'

function MiniTodoList(props) {
  let startingTodos = (typeof props.todos == 'undefined') ? [] : props.todos;

  const [todos, setTodos] = useState(startingTodos);

  const onAddTodo = (e) => {
    let newTodo = { content: e.target.value };
    let newTodos = [...todos, newTodo];
    setTodos(newTodos);
    if (typeof props.onChangeTodos !== 'undefined') {
      props.onChangeTodos(newTodos);
    }
  };

  const onChangeTodo = (currentTodo, index) => {
    let newTodos = [];
    for (let i = 0; i < todos.length; i++) {
      if (i !== index) {
        newTodos.push(todos[i]);
      } else {
        newTodos.push(currentTodo);
      }
    }
    setTodos(newTodos);
    if (typeof props.onChangeTodos !== 'undefined') {
      props.onChangeTodos(newTodos);
    }
  };

  const onRemoveTodo = (id) => {
    let todosLeft = todos.filter((t, indx) => indx !== id);
    setTodos(todosLeft);
    if (typeof props.onChangeTodos !== 'undefined') {
      props.onChangeTodos(todosLeft);
    }
  };


  return (
    <div>
      {todos.map((t, indx) => <Todo
        key={indx}
        id={indx}
        content={t.content}

        style={props.style}

        onRemove={onRemoveTodo}
        onChangeTodo={onChangeTodo} />)}
      <button onClick={onAddTodo}> Add Todo </button>
    </div>
  );
}
export default MiniTodoList;