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
    schedulerData.setEvents(props.events);
    this.state = {
      viewModel: schedulerData
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.events.length !== this.props.events.length) {
      this.state.viewModel.setEvents(this.props.events)
      this.forceUpdate()
    }
  }

  render() {
    return (
      <Scheduler
        schedulerData={this.state.viewModel}
        prevClick={() => { }}
        nextClick={() => { }}
        onSelectDate={() => { }}
        onViewChange={() => { }}
        eventItemClick={() => { }}
      />
    );
  }
}

export default DragDropContext(HTML5Backend)(MyCalendar);
