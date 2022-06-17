import React from 'react'
import { useEffect, useState, useCallback } from 'react'

import { db } from "../../firebase"
import { async } from "@firebase/util"
import {  doc, 
          setDoc, 
          addDoc, 
          collection, 
          query, 
          where,
          getDocs, 
          onSnapshot,
          deleteDoc  } from "firebase/firestore"; 

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import FullCalendar from "@fullcalendar/react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import './Cal.css'

import Title from '../Title.js'

const localizer = momentLocalizer(moment);

const eventss = [
  { start:  new Date(2022, 5, 14), 
    end:  new Date(2022, 5, 21), 
    title: "special event" },
  { start:  new Date(2022, 5, 4), 
    end:  new Date(2022, 5, 4), 
    title: "special event" },
  { start:  new Date(2022, 5, 6), 
    end:  new Date(2022, 5, 8), 
    title: "special event" },
  { start:  new Date(2022, 5, 6), 
    end:  new Date(2022, 5, 6), 
    title: "math testefderfwerfre" }
];

const CalendarScheduler = () => {
  const [events, setEvent] = useState([])

  const createNewEvent = (e) => {
    let inputText = window.prompt("Create a new event")
    let newEvent = {
      start : e.start,
      end: e.end,
      title: inputText
    }
    let newEvents = [...events, newEvent]
    setEvent(() => newEvents)
  }

  const deleteCurrentEvent = (e) => {
    let confirmDelete = window.confirm("Delete this event?")
    let newEvents = events.filter((event) => event.title != e.title)
    setEvent(() => newEvents)
  }

  return (
      <div className="App">
        <Title name={"Calendar"}/>
        <Calendar
          defaultDate={moment().toDate()}
          defaultView="month"
          views={['month','week']}
          localizer={localizer}
          events={events}
          selectable
          onSelectEvent={deleteCurrentEvent}
          onSelectSlot={createNewEvent}
        />      
      </div>
    );
}



export default CalendarScheduler