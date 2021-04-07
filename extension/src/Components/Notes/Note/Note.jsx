import { useState, useEffect, useRef } from "react";
import './Note.css';
import { AiOutlineClose } from 'react-icons/ai';
import TextareaAutosize from 'react-textarea-autosize';
import MiniTodoList from '../MiniTodoList'


function Note({ note, onRemoveNote, onChangeNote }) {
  const [noteCopy, setNoteCopy] = useState(note);
  const [width, setWidth] = useState()
  const NoteTypes = { "TODO": "TODO", "NOTE": "NOTE" }
  const noteHtmlNode = useRef(null);
  const titleTextAreaRef = useRef(null);
  const contentTextAreaRef = useRef(null);

  const dimensions = {
    height: window.innerHeight,
    width: window.innerWidth
  }

  let textColors = ["#ccc", "#d7b2FF", "#FBD5EC", "#A7DDFA", "#eeffee", "#41402E", "#FFEDC0"];
  let backgroundColors = ["#333", "#442666", "#7A4364", "#2D5F7A", "#2FA853", "#E6E34C", '#8F4623'];
  let headerColors = ["#444", "#695580", "#C76DA3", "#4897C2", "#5EA86C", "#ADAC51", "#E68550"];

  let defX = (window.innerWidth - (note.type === NoteTypes.TODO ? 300 : 200));
  defX = defX < 0 ? 0 : defX;
  defX = "" + defX + "px";
  let newPosX = (typeof note.posX === 'undefined') ? defX : note.posX;
  let newPosY = (typeof note.posY === 'undefined') ? "100px" : note.posY;


  const hashCode = (str) => {
    let hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

  let intId = (5 + hashCode(note._id)) % backgroundColors.length;

  const noteStyle = {
    top: newPosY,
    left: newPosX,
    backgroundColor: backgroundColors[intId],
    width: ""+(parseInt(width,10)*1.06)+"px"
  };

  const noteStyleTodo = {
    top: newPosY,
    left: newPosX,
    backgroundColor: backgroundColors[intId],
  };


  const headerStyle = {
    backgroundColor: headerColors[intId],
    color: textColors[intId],
    width: ""+(parseInt(width,10)*1.06)+"px"
  };

  const headerTodoStyle = {
    backgroundColor: headerColors[intId],
    color: textColors[intId],
  };

  const titleStyle = {
    backgroundColor: headerColors[intId],
    color: textColors[intId],
    width: width
  };

  const titleStyleTodo = {
    backgroundColor: headerColors[intId],
    color: textColors[intId],
  };


  const dragStyle = {
    backgroundColor: headerColors[intId],
    color: textColors[intId],
  };

  const contentStyle = {
    backgroundColor: backgroundColors[intId],
    color: textColors[intId],
    width: width
  };

  const submitChanges = (val, field) => {
    onChangeNote({ _id: note._id, [field]: val });
  }

  const onChange = (val, field) => {
    setNoteCopy({ ...noteCopy, [field]: val })
  }

  const handleCloseElement = (e) => {
    onRemoveNote(note._id);
  }

  const dragElement = (e) => {
    const elmnt = noteHtmlNode.current;
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
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
      const posX = elmnt.style.left;
      const posY = elmnt.style.top;
      onChange(posX, "posX")
      onChange(posY, "posY")
      onChangeNote({ _id: note._id, "posX": posX, "posY": posY });
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  useEffect(() => {

    function debounce(func) {
      var timer;
      return function (event) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(func, 100, event);
      };
    }

    function handleResize() {
      const element = noteHtmlNode.current;
      if (!element) {
        return
      }
      if (window.innerWidth < (element.offsetLeft + element.offsetWidth + 15)) {
        let newLeft = (window.innerWidth - element.offsetWidth - 15);
        newLeft = newLeft < 0 ? 0 : newLeft;
        element.style.left = "" + newLeft + "px";
      }

      if (window.innerHeight < (element.offsetTop + element.offsetHeight + 15)) {
        let newTop = (window.innerHeight - element.offsetHeight - 15);
        newTop = newTop < 0 ? 0 : newTop;
        element.style.top = "" + newTop + "px";
      }



      dimensions.height = window.innerHeight;
      dimensions.width = window.innerWidth;


    }

    window.addEventListener('resize', debounce(handleResize));

  });

  useEffect(() => {
    if (titleTextAreaRef?.current && contentTextAreaRef?.current) {
      new ResizeObserver(() => {
        if (titleTextAreaRef?.current) {
          setWidth(titleTextAreaRef.current.style.width)

        }
        // TODO(alexgz9851): save into db
      }).observe(titleTextAreaRef.current)
      new ResizeObserver(() => {
        if (contentTextAreaRef?.current) {
          setWidth(contentTextAreaRef.current.style.width)
        }
        // TODO(alexgz9851): save into db
      }).observe(contentTextAreaRef.current)
    }
  }, [titleTextAreaRef, contentTextAreaRef])

  return (
    <>
    {noteCopy.type === NoteTypes.TODO ?
      <div id={noteCopy._id}
        className="nota-todo"
        style={noteStyleTodo}
        ref={noteHtmlNode}>
        <div style={headerTodoStyle} className="nota-header">
          <div className="nota-bar" style={dragStyle} >
            <div className="nota-drag" id={noteCopy._id + 'drag'} onMouseDown={dragElement}></div>
            <div className="nota-close"
              id={noteCopy._id + 'close'}
              onClick={handleCloseElement}
            ><AiOutlineClose className='icon' /></div>
          </div>

          <TextareaAutosize className='nota-header-content' type="text"
            ref={titleTextAreaRef}
            value={noteCopy.title}
            id={noteCopy._id + 'title'}
            name={noteCopy._id + 'title'}
            placeholder="Add a cool task here."
            style={titleStyleTodo}
            minRows={1}
            maxRows={10}
            onBlur={(ev) => submitChanges(ev.target.value, "title")}
            onChange={(ev) => onChange(ev.target.value, "title")} />
        </div>
        <MiniTodoList className='nota-content-todo'
          todos={noteCopy.todo}
          onChangeTodos={(todos) => submitChanges(todos, "todo")}
          style={contentStyle} />
      </div >
      :
      <div id={noteCopy._id}
        className="nota"
        style={noteStyle}
        ref={noteHtmlNode}>
        <div style={headerStyle} className="nota-header">
          <div className="nota-bar" style={dragStyle} >
            <div className="nota-drag" id={noteCopy._id + 'drag'}
              onMouseDown={dragElement}></div>
            <div className="nota-close"
              id={noteCopy._id + 'close'}
              onClick={handleCloseElement}>
                <AiOutlineClose className='icon' /></div>
          </div>

          <TextareaAutosize className='nota-header-content' type="text"
            ref={titleTextAreaRef}
            value={noteCopy.title}
            id={noteCopy._id + 'title'}
            name={noteCopy._id + 'title'}
            placeholder="Add a cool task here."
            style={titleStyle}
            minRows={1}
            maxRows={10}
            onBlur={(ev) => submitChanges(ev.target.value, "title")}
            onChange={(ev) => onChange(ev.target.value, "title")} />
        </div>
        <TextareaAutosize className='nota-content' type="text"
          ref={contentTextAreaRef}
          value={noteCopy.content || ""}
          id={noteCopy._id + 'content'}
          name={noteCopy._id + 'content'}
          minRows={3}
          maxRows={50}
          placeholder="What's the task about?"
          style={contentStyle}
          onBlur={(ev) => submitChanges(ev.target.value, "content")}
          onChange={(ev) => onChange(ev.target.value, "content")} />
      </div >
    }
    </>
  );
}

export default Note;