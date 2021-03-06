import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Header from '../Header/Header.js'
import Title from '../Title/Title.js'
import active from '../img/active.png'
import archive from '../img/archive.png'
import CalendarHeatmap from "react-calendar-heatmap";
import EditIcon from "@mui/icons-material/Edit"
import {db} from "../../firebase.js"
import { UserAuth } from '../../context/AuthContext'
import {
    collection,
    query,
    onSnapshot,
    where
} from "firebase/firestore"
import ReactTooltip from 'react-tooltip';

/* Determine colour scale for Task Completion activity heatmap */ 
let colourTaskCompletion = (value) => {
    let colScale = 1
    if (!value) {
      return 'color-empty';
    } else {
        let count = value.count
        switch (true) {
            case count <= 3:
                colScale = 1
                break
            case count <= 5:
                colScale = 2
                break
            case count <= 10:
                colScale = 3
                break
            case count <= 15:
                colScale = 4
                break
            case count > 15:
                colScale = 5
                break
            default:
                colScale = "empty"
        }
    }
    return `color-scale-${colScale}`
}

/* Determine colour scale for Focus Sessions activity heatmap */ 
let colourFocusSessions = (value) => {
    let colScale = 1
    if (!value) {
      return 'color-empty';
    } else {
        // Convert to hours for colour scale.
        let count = (value.count) / 3600000
        switch (true) {
            case count <= 3:
                colScale = 1
                break
            case count <= 5:
                colScale = 2
                break
            case count <= 10:
                colScale = 3
                break
            case count <= 15:
                colScale = 4
                break
            case count > 15:
                colScale = 5
                break
            default:
                colScale = "empty"
        }
    }
    return `color-scale-${colScale}`
}

const Analytics = () => {

    const {user}  = UserAuth()
    const [tasksCompleted, setTasksCompleted] = useState([])
    const [timeStudied, setTimeStudied] = useState([])
    const [totalTasksCompleted, setTotalTasksCompleted] = useState(0)
    const [totalTimeStudied, setTotalTimeStudied] = useState(0)

    /* Calculate total number of tasks completed by user */
    const calculateTotalTasksCompleted = (taskRecords) => {
        let counter = 0
        taskRecords.forEach((task) => {
            counter += task.count
        })
        setTotalTasksCompleted(() => counter)
    }

    /* Calculate total time spent in focus session by user */
    const calculateTotalTimeStudied = (sessions) => {
        let counter = 0
        sessions.forEach((task) => {
            counter += task.count
        })
        setTotalTimeStudied(() => counter)
    }

    /* Retrieve all user task completion records by day for the activity heatmap */
    useEffect(() => {
        let active = true
        if (active === true & user.uid != null) {
            const q = query(collection(db, "todos-record"), where("uid", "==", user.uid))
            console.log("Retrieving user task completion records")
            console.log(user.uid)
            onSnapshot(q, (querySnapshot) => {
                let taskRecords = []
                querySnapshot.forEach((doc) => {
                    let record = {
                        date: doc.data()['date'],
                        count: doc.data()['count']
                    }
                    taskRecords.push(record)
                })
                setTasksCompleted(() => taskRecords)
                calculateTotalTasksCompleted(taskRecords)
            })
            return () => {active = false}}
    }, [user.uid, totalTasksCompleted])

    /* Retrieve all user time studied records by day for the activity heatmap */
    useEffect(() => {
        let active = true
        if (active === true & user.uid != null) {
            const q = query(collection(db, "time-studied-record"), where("uid", "==", user.uid))
            console.log("Retrieving user time studied records")
            onSnapshot(q, (querySnapshot) => {
                let timeStudiedRecords = []
                querySnapshot.forEach((doc) => {
                    let record = {
                        date: doc.data()['date'],
                        // in milliseconds
                        count: Number((doc.data()['time']))
                    }
                    timeStudiedRecords.push(record)
                    console.log(timeStudiedRecords)
                })
                setTimeStudied(() => timeStudiedRecords)
                calculateTotalTimeStudied(timeStudiedRecords)
            })
            return () => {active = false}}
    }, [user.uid])

    return (
        <div id="profile-container" data-cy="profile">
            <Header />
            <Title name={"Profile"} />
            <div id="achievements-container">
                <div id="side-column-container">
                    <div id="side-column-journal-container">
                        <div id="side-column-journal-title-container">
                            <h3 id="side-column-journal-title">Mood Journals</h3>
                            <NavLink id='side-col-edit-journal-links' to='/journal' data-cy="create-journal">
                                <EditIcon />
                            </NavLink>
                        </div>
                        <div id='side-column-books-container'>
                            <NavLink className='side-column-img-links' to='/archived-thoughts' data-cy="archived-thoughts">
                                <img className='side-column-img' alt="archived-journal" src={archive}></img>
                            </NavLink>
                            <NavLink className='side-column-img-links' to='/active-thoughts' data-cy="active-thoughts">
                                <img className='side-column-img' alt="active-journal" src={active}></img>
                            </NavLink>
                        </div>
                    </div>
                    <div id="side-column-links-container">
                        <NavLink 
                            className='side-column-ext-links' 
                            to='/bubbles'
                            data-cy="nav-to-bubbles"
                            state={totalTasksCompleted != null && { numBubbles: totalTasksCompleted}}
                        >
                            Pop some bubbles!
                        </NavLink>
                        <NavLink className='side-column-ext-links' to='/achievements'>
                            View Badges Collected
                        </NavLink>
                    </div>
                </div>
                <div id="analytics-container">
                    <h3 id="analytics-title">Your Activity at a glance</h3>
                    <div id='overall-analytics-container'>
                        <p className="overall-analytics-desc">{totalTasksCompleted} tasks completed</p>
                        { /* Convert milliseconds to hours */}
                        <p className="overall-analytics-desc">{(totalTimeStudied / 3600000) < 1 ? `< 1` : (totalTimeStudied / 3600000).toFixed(2)} hours spent studying</p>
                    </div>
                    <h3 className="analytics-heatmap-title">Focus Sessions</h3>
                    <CalendarHeatmap
                            className="activity-calendar"
                            startDate={new Date(`${new Date().getFullYear()-1}-12-31`)}
                            endDate={new Date(`${new Date().getFullYear()}-12-31`)}
                            values={timeStudied}
                            classForValue= {colourFocusSessions}
                            tooltipDataAttrs={value => {
                                let count = 0;
                                let displaySec = 0;
                                let displayMin = 0;
                                let displayHours = 0;

                                const toTwoDigits = num => {
                                    return num.toString().padStart(2, '0');
                                };

                                if (value.count != null) {
                                    count = value.count.toFixed(6);
                                    displaySec = Math.floor(count / 1000);
                                    displayMin = Math.floor(displaySec / 60);
                                    displayHours = Math.floor(displayMin / 60);
                                    
                                    displaySec = displaySec % 60;
                                    displayMin = displayMin % 60;
                                };
                                return {
                                  'data-tip': `${toTwoDigits(displayHours)}h ${toTwoDigits(displayMin)}m ${toTwoDigits(displaySec)}s studied`
                                };
                            }
                        }
                    />
                    <h3 className="analytics-heatmap-title">Task Completion</h3>
                    <CalendarHeatmap
                        className="activity-calendar"
                        startDate={new Date(`${new Date().getFullYear()-1}-12-31`)}
                        endDate={new Date(`${new Date().getFullYear()}-12-31`)}
                        values={tasksCompleted}
                        classForValue={colourTaskCompletion}
                        tooltipDataAttrs={value => {
                            let count = 0
                            if (value.count != null) {
                                count = value.count
                            }
                            return {
                                'data-tip': `${count} tasks completed`
                            }
                        }
                    }
                    />
                    <ReactTooltip />
                </div>
            </div>
        </div>
    )
}

export default Analytics