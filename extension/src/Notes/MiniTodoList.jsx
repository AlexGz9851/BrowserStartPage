import React, {useState} from "react";
import './MiniTodoList.css';
import Todo from './Todo.jsx'

function MiniTodoList(props){
    let startingTodos = (typeof props.todos == 'undefined') ? [] : props.todos;

    const [todos, setTodos] = useState(startingTodos);

    const onAddTodo = (e) => {
        let newTodo = {id: "" + parseInt(Math.random()*10000, 10), content: e.target.value};
        let newTodos = [ ...todos, newTodo];
        setTodos(newTodos);
        if( typeof props.onChangeTodos  !== 'undefined'){
            props.onChangeTodos(newTodos);
        }
    };

    const onChangeTodo = (currentTodo) =>{
        console.log(currentTodo);
        console.log(todos)
        let newTodos =[];
        for(let t in todos){
            if(t.id !== currentTodo.id){
                newTodos.push(t);
            }else{
                newTodos.push(currentTodo);
            }
        }
        setTodos(newTodos);
        if( typeof props.onChangeTodos  !== 'undefined'){
            props.onChangeTodos(newTodos);
        }
    };

    const onRemoveTodo = (id) =>{
        let remainingTodos = todos.filter((t)=> t.id !== id);
        setTodos(remainingTodos);
        if( typeof props.onChangeTodos  !== 'undefined'){
            props.onChangeTodos(remainingTodos);
        }
    };
    

    return (
        <div>
            {todos.map((t) => {
                console.log(t.id)
                return <Todo 
                id={t.id}
                key={t.id}
                content={t.content} 

                style={props.style}

                onRemove={onRemoveTodo}  
                onChangeTodo={onChangeTodo}/>
            })}
        <button onClick={onAddTodo}> Add Todo </button>
        </div>
    );
}
export default MiniTodoList;