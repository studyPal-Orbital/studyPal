import { Task } from "@mui/icons-material";
import { updateDoc } from "firebase/firestore";
import React from "react";
import { useState, useEffect } from "react";


import {db} from "../../firebase.js"
import {
    collection,
    query,
    onSnapshot,
    doc,
    setDoc,
    deleteDoc,
    where,
    QuerySnapshot,
    addDoc
  } from "firebase/firestore"

import { UserAuth } from "../../context/AuthContext.js"

import { NavLink } from "react-router-dom";


const Todoitem = ({title, body, urgency, completed, createdAt, id}) => {
    const { user } = UserAuth()
    let currentDate = new Date().toISOString().split('T')[0].toString()
    let newRecordID = currentDate + '-' + user.uid

    const [showContent, setShowContent] = useState(false)
    const [currentRecords, setCurrentRecords] = useState([])

    useEffect(() => {
        let active = true
        if (active == true & user.uid != null) {
          const q = query(collection(db, "todos-record"), where("recordID", "==", newRecordID))
          console.log("Retrieving task records")
          const getAllRecords = onSnapshot(q, (querySnapshot) => {
            let records = []
            querySnapshot.forEach((doc) => {
              records.push({...doc.data()})
            })
            setCurrentRecords(() => records)
            console.log(records)
          })
          return () => {active = false}}
      }, [user.uid])

    const handleDelete = async () => {
        await deleteDoc(doc(db, "todos", id))
    
        let currentRec = currentRecords.filter((rec) => rec['recordID'] == newRecordID)
        let newDate = currentRec.length == 1 ? currentRec[0]['date'] : currentDate
        let newCount = currentRec.length == 1 ? currentRec[0]['count'] + 1 : 1
        let newRecord = {
          uid: user.uid,
          recordID: newRecordID,
          date: newDate,
          count: newCount
        }
        await setDoc(doc(db, "todos-record", newRecordID), newRecord)
      }


    const toggleShowContent = () => {
        setShowContent(() => !showContent)
    }

    const toggleComplete = async(id, completed) => {
        await updateDoc(doc(db, "todos", id), {completed: !completed})
    }
    
    return (
        <div>
            <button 
                onClick={toggleShowContent} 
                style={{ textDecoration: completed && "line-through" }}>
                {title}
            </button>
            {showContent && 
                <>
                    <p>{body}</p>
                    <p>{createdAt}</p>
                    <p>{urgency}</p>
                    <button onClick={handleDelete}>Delete</button>
                    <button>
                        <NavLink to="/edit-todo" state={{ title, body, urgency, completed, createdAt, id }}>
                            Edit
                        </NavLink>
                    </button>
                    <button onClick={() => toggleComplete(id, completed)}>Complete</button>
                </>
            }
        </div>
    )
}

export default Todoitem