import { useState } from "react";
import './Note.css';


function Note({ note, onRemoveNote, onChangeNote }) {
  const [noteCopy, setNoteCopy] = useState(note);

  let textColors = ["#ccc", "#d7b2FF", "#FBD5EC", "#A7DDFA", "#eeffee", "#41402E", "#FFEDC0"];
  let backgroundColors = ["#333", "#442666", "#7A4364", "#2D5F7A", "#2FA853", "#E6E34C", '#8F4623'];
  let headerColors = ["#444", "#695580", "#C76DA3", "#4897C2", "#5EA86C", "#ADAC51", "#E68550"];

  let newPosX = note.posX;
  let newPosY = note.posY;
  const hashCode = (str) => {
    var hash = 0, i, chr;
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
  };

  const headerStyle = {
    backgroundColor: headerColors[intId],
    color: textColors[intId],
  };

  const contentStyle = {
    backgroundColor: backgroundColors[intId],
    color: textColors[intId],
  };

  const submitChanges = () => {
    onChangeNote(noteCopy);
  }

  const onChange = (val, field) => {
    setNoteCopy({ _id: note._id, [field]: val })
  }

  const handleCloseElement = (e) => {
    onRemoveNote(note._id);
  }

  const dragElement = (e) => {
    let elmnt = document.getElementById(note._id);
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
      const posX = elmnt.style.left;
      const posY = elmnt.style.top;
      onChange(posX, "posX")
      onChange(posY, "posY")
      onChangeNote({ _id: note._id, "posX": posX, "posY": posY });
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  return (
    <div id={noteCopy._id}
      className="nota"
      style={noteStyle}
    //ref={this.nota}
    >
      <div style={headerStyle} >
        <div className="nota-drag"
          style={headerStyle}
          id={noteCopy._id + 'drag'}
          onMouseDown={dragElement}
        ></div>
        <div className="nota-close"
          id={noteCopy._id + 'close'}
          onClick={handleCloseElement}
        >
        </div>
        <textarea className='nota-header' type="text"
          value={noteCopy.title}
          id={noteCopy._id + 'title'}
          name={noteCopy._id + 'title'}
          placeholder="Add a cool task here."
          style={headerStyle}
          onBlur={submitChanges}
          onChange={(ev) => { onChange(ev.target.value, "title") }}
        >
        </textarea>
      </div>
      <textarea className='nota-content' type="text"
        value={noteCopy.content || ""}
        id={noteCopy._id + 'content'}
        name={noteCopy._id + 'content'}
        placeholder="What's the task about?"
        style={contentStyle}
        onBlur={submitChanges}
        onChange={(ev) => { onChange(ev.target.value, "content") }}
      >
      </textarea>


    </div >
  );
}

export default Note;
