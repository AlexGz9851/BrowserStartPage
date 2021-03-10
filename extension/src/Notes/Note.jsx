import React, {useState} from "react";
import './Note.css';


function Note(props){
  const [title, setTitle] = useState(props.title);
  const [id, setId] = useState(props.id);
  const [content, setContent] = useState(props.content);
  const [posX, setPosX] = useState(props.posX);
  const [posY, setPosY] = useState(props.posY);

  
  let textColors = ["#ccc","#d7b2FF", "#FBD5EC","#A7DDFA","#eeffee","#41402E","#FFEDC0"];
  let backgroundColors = ["#333","#442666","#7A4364","#2D5F7A","#2FA853","#E6E34C",'#8F4623'];
  let headerColors = ["#444","#695580","#C76DA3","#4897C2","#5EA86C","#ADAC51","#E68550"];

  let defX = ""+(window.innerWidth- 200)+"px";
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

  const contentStyle = {
    backgroundColor: backgroundColors[intId],
    color:textColors[intId],
  };
  
  const handleChangeContent = (e) =>{
    e.preventDefault();
    setContent(e.target.value);
    if (typeof props.onChangeNote !== 'undefined'){
      let note = {id:id, title:title, content:content, posX:posX, posY:posY};
      console.log(note);
      props.onChangeNote(note);
    }
  };
  
  const handleChangeTitle= (e) =>{
    e.preventDefault();
    setTitle(e.target.value);
    if (typeof props.onChangeNote !== 'undefined'){
      let note = {id:id, title:title, content:content, posX:posX, posY:posY};
      props.onChangeNote(note);
    }
  };

  const onChangeTitle = (e) =>{
    e.preventDefault();
    setTitle(e.target.value);
  };

  const onChangeContent = (e) =>{
    e.preventDefault();
    setContent(e.target.value);
  };

  const handleCloseElement= (e) =>{
    e.preventDefault();
    if (typeof props.onRemove !== 'undefined'){
      props.onRemove(id);
    }
  }

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
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      setPosX(elmnt.style.left)
      setPosY(elmnt.style.top)
      let note = {id:id, title:title, content:content, posX:elmnt.style.left, posY:elmnt.style.top};
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
        style={headerStyle}
        id={id+'drag'}
        onMouseDown={dragElement}
        ></div>
      <div className="nota-close"
        id={id+'close'}
        onClick={handleCloseElement}
      >
      </div>
      <textarea className='nota-header' type="text" 
        value={title}
        id={id+'title'}
        name={id+'title'}
        placeholder="Add a cool task here."
        style={headerStyle}
        onBlur={handleChangeTitle}
        onChange={onChangeTitle}
        >
      </textarea>
      </div>
      <textarea className='nota-content' type="text" 
        value={content}
        id={id+ 'content'}
        name={ id +'content'}
        placeholder="What's the task about?"
        style={contentStyle}
        onBlur={handleChangeContent}
        onChange={onChangeContent}
        >
      </textarea>


    </div>
  );
}

export default Note;