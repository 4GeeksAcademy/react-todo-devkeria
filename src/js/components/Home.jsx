import React, { useState, useEffect } from "react";
import "../../styles/index.css";

const username = "keria"; 

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");


  useEffect(() => {
    fetch(`https://playground.4geeks.com/todo/todos/${username}`)
      .then(res => {
        if (res.status === 404) {
          return fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
            method: "POST",
            body: JSON.stringify([]),
            headers: {
              "Content-Type": "application/json"
            }
          });
        }
      })
      .finally(() => loadTasks());
  }, []);

  // Load task list (GET)
  const loadTasks = () => {
    fetch(`https://playground.4geeks.com/todo/todos/${username}`)
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => {
        console.log("Error loading tasks:", err);
        setTasks([]);
      });
  };

  // Add one task (POST)
  const addTask = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const newTask = { label: inputValue, done: false };
      fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
        method: "POST",
        body: JSON.stringify(newTask),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(() => {
          setInputValue("");
          loadTasks();
        })
        .catch(err => console.log("Error adding task:", err));
    }
  };

  // Delete one task (DELETE)
  const deleteTask = (id) => {
    fetch(`https://playground.4geeks.com/todo/todos/${username}/${id}`, {
      method: "DELETE"
    })
      .then(() => loadTasks())
      .catch(err => console.log("Error deleting task:", err));
  };

  // Clear all tasks (DELETE)
  const clearAll = () => {
    fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
      method: "DELETE"
    })
      .then(() => setTasks([]))
      .catch(err => console.log("Error clearing tasks:", err));
  };

  return (
    <div className="todo-container">
      <h1>todos</h1>
      <ul>
        <li>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={addTask}
          />
        </li>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.label}
            <span onClick={() => deleteTask(task.id)}>❌</span>
          </li>
        ))}
        <li>{tasks.length} item{tasks.length !== 1 && "s"} left</li>
      </ul>
      <button onClick={clearAll}>Clear All Tasks</button>
    </div>
  );
};

export default Home;
