import Title from '../Title.js'
import AddTodo from './AddTodo.js'
import Todoitem from './Todoitem.js'

import React from "react"
import { useState, useEffect } from "react"

import ElderlyWomanIcon from '@mui/icons-material/ElderlyWoman';

import {db} from "../../firebase.js"
import {
    collection,
    query,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    QuerySnapshot,
    orderBy
  } from "firebase/firestore"


const Todolist =  () => {
  const [currentTasks, setCurrentTasks] = useState([])
  
  useEffect(() => {
    let active = true
    if (active == true) {
      const q = query(collection(db, "todos"), orderBy('createdAt'))
      const getAllTasks = onSnapshot(q, (querySnapshot) => {
      let tasks = []
      querySnapshot.forEach((doc) => {
        tasks.push({...doc.data(), id:doc.id})
      })
      setCurrentTasks(() => tasks)
    })}
    return () => {active = false}
  },[])

  return (
    <div className="todo-list-main">
      <Title name={"Todo List"}/>
      <AddTodo />
      {currentTasks.map((todo) => (
        <Todoitem 
          item={todo}
        />
      ))}
    </div>
  )
}

export default Todolist