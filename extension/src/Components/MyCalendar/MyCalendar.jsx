import React from 'react';
import Scheduler, { SchedulerData, ViewTypes } from 'react-big-scheduler'
import 'react-big-scheduler/lib/css/style.css'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import moment from 'moment';
import './MyCalendar.css'
import SchedulerConfig from './SchedulerConfig';

class MyCalendar extends React.Component {
  constructor(props) {
    super(props);
    const schedulerData = new SchedulerData(new Date(), ViewTypes.Day, false, false, SchedulerConfig);
    schedulerData.setResources([{
      id: 'r0',
      name: 'events'
    }])
    schedulerData.setLocaleMoment(moment);
    this.state = {
      myEventsList: [
      ],
      isSignedIn: false,
      viewModel: schedulerData
    };
    this.listUpcomingEvents = this.listUpcomingEvents.bind(this);
    this.iniciarSesion = this.iniciarSesion.bind(this);
    this.cerrarSesion = this.cerrarSesion.bind(this);
  }


  listUpcomingEvents() {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    window.gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': date.toISOString(),
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
        obj['start'] = start_time.substr(0, start_time.length - 6);
        obj['end'] = end_time.substr(0, end_time.length - 6);
        obj.id = i;
        obj.resourceId = 'r0'
        this.state.viewModel.addEvent(obj)
      }
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
        <Scheduler
          schedulerData={this.state.viewModel}
          prevClick={() => { }}
          nextClick={() => { }}
          onSelectDate={() => { }}
          onViewChange={() => { }}
          eventItemClick={() => { }}
        />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(MyCalendar);
