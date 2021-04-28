import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

class MyCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      localizer: momentLocalizer(moment),
      myEventsList: [
      ],
      isSignedIn: false,
    };
    this.listUpcomingEvents = this.listUpcomingEvents.bind(this);
    this.iniciarSesion = this.iniciarSesion.bind(this);
    this.cerrarSesion = this.cerrarSesion.bind(this);
  }


  listUpcomingEvents() {
    window.gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    }).then((response) => {

      var events = response.result.items;
      let dict = []

      for (let i = 0; i < events.length; i++) {
        let obj = {};
        let start_time = events[i]["start"]["dateTime"];
        let end_time = events[i]["end"]["dateTime"];
        if (!start_time) {
          start_time = events[i]["start"]["date"] + "T00:00:00-00:00"
          end_time = events[i]["start"]["date"] + "T23:59:59-00:00"
        }
        obj['title'] = events[i]["summary"];
        obj['start'] = new Date(start_time.substr(0, start_time.length - 6));
        obj['end'] = new Date(end_time.substr(0, end_time.length - 6));
        dict.push(obj);
      }
      this.setState({
        myEventsList: dict
      })
    });
  }

  iniciarSesion(event) {
    console.log("Iniciando sesion");
    window.gapi.auth2.getAuthInstance().signIn().then(() => {
      console.log('sesion iniciada');
      this.listUpcomingEvents();
    });
    this.setState({
      isSignedIn: true
    })
  }

  cerrarSesion(event) {
    console.log('Cerrando sesion');
    window.gapi.auth2.getAuthInstance().signOut();
    this.setState({
      isSignedIn: false
    })
    this.setState({
      myEventsList: []
    })
  }

  handleClientLoad() {
    window.gapi.load('client:auth2', this.initClient);
  }

  componentDidMount() {
    this.handleClientLoad();
  }

  initClient() {
    window.gapi.client.init({
      apiKey: 'AIzaSyDZ6Xhd3wrHouKCBkmgtgRBnsYMGXLVW-I',
      clientId: '897082507710-h3ok2o6pt568cdpfi1lsfkhv930nhga0.apps.googleusercontent.com',
      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
      scope: "https://www.googleapis.com/auth/calendar.readonly"
    }).then(function () {
      console.log('Gapi started');
    });
  }



  render() {
    return (
      <div>
        {
          this.state.isSignedIn ?
            <div>
              <p>Calendario</p>
              <button id="cerrarSesion" onClick={this.cerrarSesion}>Cerrar sesion</button>
            </div>
            :
            <div>
              <p>Calendario</p>
              <button id="iniciarSesion" onClick={this.iniciarSesion}>Iniciar sesion</button>
            </div>
        }
        <div style={{ width: "200px", height: "600px" }}>
          <Calendar
            localizer={this.state.localizer}
            events={this.state.myEventsList}
            defaultDate={new Date()}
            defaultView="day"
            toolbar={false}
          />
        </div>
      </div>
    );
  }
}

export default MyCalendar;
