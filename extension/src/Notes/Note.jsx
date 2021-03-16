import React, {useState} from "react";
import './Note.css';
import {AiOutlineClose} from 'react-icons/ai';
import TextareaAutosize from 'react-textarea-autosize';
import MiniTodoList from './MiniTodoList.jsx'


function Note(props){
  const [title, setTitle] = useState(props.title);
  const [id, setId] = useState(props.id);
  const [content, setContent] = useState(props.content);
  const [posX, setPosX] = useState(props.posX);
  const [posY, setPosY] = useState(props.posY);
  const isTodoList = props.isTodoList;
  const [todos, setTodos] = useState(props.todos);
  //const [dimensions, setDimensions] = React.useState({ 
  //  height: window.innerHeight,
  //  width: window.innerWidth
  //})

  const dimensions = { 
      height: window.innerHeight,
      width: window.innerWidth
    }

  
  let textColors = ["#ccc","#d7b2FF", "#FBD5EC","#A7DDFA","#eeffee","#41402E","#FFEDC0"];
  let backgroundColors = ["#333","#442666","#7A4364","#2D5F7A","#2FA853","#E6E34C",'#8F4623'];
  let headerColors = ["#444","#695580","#C76DA3","#4897C2","#5EA86C","#ADAC51","#E68550"];

  let defX = (window.innerWidth- (isTodoList ? 300 : 200));
  defX = defX < 0 ?  0 : defX;
  defX = ""+ defX +"px";
  let newPosX = (typeof posX === 'undefined') ? defX : posX; 
  let newPosY = (typeof posY === 'undefined') ? "100px": posY;

  const hashCode = (str) => {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };
  let intId = (5+ hashCode(id)) % backgroundColors.length;

  const noteStyle = {
    top:newPosY,
    left:newPosX,
    backgroundColor: backgroundColors[intId],
  };

  const headerStyle = {
    backgroundColor: headerColors[intId],
    color:textColors[intId],
  };

  const titleStyle = {
    backgroundColor: headerColors[intId],
    color:textColors[intId],
  };

  const dragStyle = {
    backgroundColor: headerColors[intId],
    color:textColors[intId],
  };

  const contentStyle = {
    backgroundColor: backgroundColors[intId],
    color:textColors[intId],
  };

  
  if(isTodoList){
    let widthTodoList = 250;
    noteStyle.width = widthTodoList +"px";
    contentStyle.width = (widthTodoList-10) +"px";
    headerStyle.width = widthTodoList +"px";
    dragStyle.width = (widthTodoList-18) +"px";
    titleStyle.width = (widthTodoList-4) +"px";
  }
  
  const handleChangeContent = (e) =>{
    e.preventDefault();
    setContent(e.target.value);
    if (typeof props.onChangeNote !== 'undefined'){
      let note = {id:id, title:title, content:content, posX:posX, posY:posY, isTodoList: isTodoList, todos:todos};
      console.log(note);
      props.onChangeNote(note);
    }
  };
  
  const handleChangeTitle= (e) =>{
    e.preventDefault();
    setTitle(e.target.value);
    if (typeof props.onChangeNote !== 'undefined'){
      let note = {id:id, title:title, content:content, posX:posX, posY:posY, isTodoList: isTodoList, todos:todos };
      props.onChangeNote(note);
    }
  };

  const handleChangeTodo = (newTodos) =>{
    setTodos(newTodos);
    if (typeof props.onChangeNote !== 'undefined'){
      let note = {id:id, title:title, content:content, posX:posX, posY:posY, isTodoList: isTodoList, todos:newTodos };
      props.onChangeNote(note);
    }
  };

  const handleCloseElement= (e) =>{
    e.preventDefault();
    if (typeof props.onRemove !== 'undefined'){
      props.onRemove(id);
    }
  }

  const onChangeTitle = (e) =>{
    e.preventDefault();
    setTitle(e.target.value);
  };

  const onChangeContent = (e) =>{
    e.preventDefault();
    setContent(e.target.value);
  };

  React.useEffect(() => {

    function debounce(func){
      var timer;
      return function(event){
        if(timer) clearTimeout(timer);
        timer = setTimeout(func,100,event);
      };
    }

    function handleResize() {
      let element = document.getElementById(id);
      if(window.innerWidth <(element.offsetLeft + element.offsetWidth + 15)){
        let newLeft = (window.innerWidth - element.offsetWidth - 15);
        newLeft = newLeft < 0 ? 0 : newLeft;
        element.style.left = "" + newLeft + "px";
      }

      if(window.innerHeight <(element.offsetTop + element.offsetHeight + 15)){
        let newTop = (window.innerHeight - element.offsetHeight - 15);
        newTop = newTop < 0 ? 0 : newTop;
        element.style.top = "" + newTop + "px";
      }
      
      

      dimensions.height =  window.innerHeight;
      dimensions.width = window.innerWidth;
      
    
    }

    window.addEventListener('resize', debounce(handleResize));
    
  });

  const   dragElement = (e)=> {
    let elmnt = document.getElementById(id);
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      let newTop = (elmnt.offsetTop - pos2);
      let newLeft = (elmnt.offsetLeft - pos1);
      if(newTop < 0){
        newTop = 0;
      }else if(newTop > (window.innerHeight - elmnt.offsetHeight- 5)){
        newTop = (window.innerHeight - elmnt.offsetHeight - 5);
      }
      console.log(elmnt.offsetHeight, elmnt.offsetWidth);

      if(newLeft < 0){
        newLeft = 0;
      }else if(newLeft > (window.innerWidth- elmnt.offsetWidth -5)){
        newLeft = (window.innerWidth - elmnt.offsetWidth -5);
      }

      elmnt.style.top = newTop + "px";
      elmnt.style.left = newLeft + "px";
    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      setPosX(elmnt.style.left)
      setPosY(elmnt.style.top)
      let note = {id:id, title:title, content:content, posX:elmnt.style.left, posY:elmnt.style.top, isTodoList: isTodoList, todos:todos};
      props.onChangeNote(note);
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  

  return (
    <div id={id} 
      className="nota" 
      style={noteStyle}
      //ref={this.nota}
    >
      <div style={headerStyle} >
      <div className="nota-drag"  
        style={dragStyle}
        id={id+'drag'}
        onMouseDown={dragElement}
        ></div>
      <div className="nota-close"
        id={id+'close'}
        onClick={handleCloseElement}
      >
        <AiOutlineClose className='icon'/>
      </div>
      <TextareaAutosize className='nota-header' type="text" 
        value={title}
        id={id+'title'}
        name={id+'title'}
        placeholder="Add a cool task here."
        minRows={1}
        maxRows={10}
        style={titleStyle}
        onBlur={handleChangeTitle}
        onChange={onChangeTitle}
        />
      </div>
      {isTodoList ? 
      <MiniTodoList className='nota-content' 
        todos={todos}
        onChangeTodos={handleChangeTodo}
        style={contentStyle}/> 
        :
      <TextareaAutosize className='nota-content' type="text" 
        value={content}
        id={id+ 'content'}
        name={ id +'content'}
        minRows={3}
        maxRows={50}
        placeholder="What's the task about?"
        style={contentStyle}
        onBlur={handleChangeContent}
        onChange={onChangeContent}
        />
      }
    </div>
  );
}

export default Note;