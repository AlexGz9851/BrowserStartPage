import { useState, useEffect } from 'react';
import "./DateTimeClock.css";
import { Typography, Grid } from "@material-ui/core";

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function DateTimeClock() {
  const [time, setTime] = useState(new Date());
  const dateString = `${weekdays[time.getDay()]}, ${months[time.getMonth()]} ${time.getDate()}, ${time.getFullYear()}`;
  const hour = ("0" + (time.getHours() % 13 + 1)).slice(-2)
  const minutes = ("0" + time.getMinutes()).slice(-2)
  const timeString = `${hour}:${minutes}`
  const meridian = time.getHours() > 11 ? "PM" : "AM"

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000 * (60 - time.getSeconds()));
    return () => clearInterval(interval);
  })

  return (
    <div className="DateTime">
      <Typography variant="h1">{timeString}<small>{meridian}</small></Typography>
      <Typography variant="h2">{dateString}</Typography>
    </div>
  );
}

export default DateTimeClock;
