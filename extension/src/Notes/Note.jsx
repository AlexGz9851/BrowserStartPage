import React from "react";
import './Note.css'


class Note extends React.Component {
  constructor(props) {
    super(props);
    this.id = props.id;

    this.getIdTag = this.getIdTag.bind(this);
    this.setContentText = this.setContentText.bind(this);
    this.setTitleText = this.setTitleText.bind(this);

    this.state = {title:this.props.title, content:this.props.content,};
    this.textColors = ["#ccc","#d7b2FF", "#FBD5EC","#A7DDFA","#eeffee","#41402E","#FFEDC0"]
    this.backgroundColors = ["#333","#442666","#7A4364","#2D5F7A","#2FA853","#E6E34C",'#8F4623']
    this.headerColors = ["#444","#695580","#C76DA3","#4897C2","#5EA86C","#ADAC51","#E68550"]
  }

  getIdTag(subsection){
    return "nota" + this.id + subsection;
  }

  getObj(id){
    return document.getElementById(id);
  }

  setContentText(event, elmnt){
    this.setState({content:event.target.value});
    if (typeof this.props.onTitleChanged !== 'undefined'){
      this.props.onTitleChanged(event, elmnt);
    }
  }
  
  setTitleText(event, elmnt){
    this.setState({title:event.target.value});
    if (typeof this.props.onTitleChanged !== 'undefined'){
      this.props.onTitleChanged(event, elmnt);
    }
  }

  closeElement(e){
    if (typeof this.props.onClose !== 'undefined'){
      this.props.onClose(e);
    }
  }

  dragElement(e, elmnt) {
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
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
    
    render() {
      let defX = ""+(window.innerWidth- 200)+"px";
      let posX = this.props.posX == null ? defX : this.props.posX; 
      let posY = this.props.posY == null ? "50px": this.props.posY;
      let intId = (5+ parseInt(this.props.id, 10)) % this.backgroundColors.length;


      const noteStyle = {
        top:posY,
        left:posX,
        backgroundColor: this.backgroundColors[intId],
      };

      const contentStyle = {
        backgroundColor: this.backgroundColors[intId],
        color:this.textColors[intId],
      };

      const headerStyle = {
        backgroundColor: this.headerColors[intId],
        color:this.textColors[intId],
      };

      return ( 
        <div id={this.getIdTag()} 
            class="nota" style={noteStyle}
            ref={this.nota}>
            <div class="nota-drag"  style={headerStyle}
                 id={this.getIdTag('drag')}
                 onMouseDown={(e) => this.dragElement(e, this.getObj(this.getIdTag()))}>
            </div>
            <div class="nota-close"
                 id={this.getIdTag('close')}
                 onClick={(e) => this.closeElement(e)}>
            </div>
            <textarea class='nota-header' type="text" 
                      value={this.state.title}
                      id={this.getIdTag('title')}
                      name={this.getIdTag('title')}
                      style={headerStyle}
                      onChange={(e) => this.setTitleText(e, this.getObj(this.getIdTag('title')))}>
            </textarea>
            <textarea class='nota-content' type="text" 
                      value={this.state.content}
                      id={this.getIdTag('content')}
                      name={this.getIdTag('content')}
                      style={contentStyle}
                      onChange={(e) => this.setContentText(e, this.getObj(this.getIdTag('content')))}>
            </textarea>
        </div>
      );
    }
}

export default Note;