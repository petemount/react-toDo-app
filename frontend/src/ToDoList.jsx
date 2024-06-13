import React, { useEffect, useState } from "react";

function TodoList() {
    const [tasks, setTasks] = useState([]);         //--> 1. Wert des Hooks useState = Wertfeld,
    const [newTask, setNewTask] = useState('');     //--> 2. Wert = Funktion für die Werteaktualisierung

// Auslagerung des Fetch-Teils, um diesen als wiederverwendbare Funktion per "fetchAllData();" immer wieder aufrufen zu können.
    function fetchAllData() {
        fetch("http://localhost:3000/tasks")
        .then((response) => response.json())
        .then((data) => setTasks(data))
        .catch((error) => console.error("Fehler beim API-Aufruf", error));
        }
    
    // Der useEffect kümmert sich hier um das 1. fetchen der Daten. 
    // useEffect(() => {}, []); --> Grundgerüst von useEffekt --> wird min. 1 mal durchlaufen und fängt 
    // ext. Interaktionen, also Nebeneffekte ab. Siehe auch https://kinsta.com/de/wissensdatenbank/react-useeffect/, wobei 
    // unter Punkt 4. Vergessen aufzuräumen die Codes für mich absolut gleich aussehen! Suheib mal fragen!
    useEffect(() => {
        fetchAllData();
    }, []);

    // Userinput abfangen.
    function handleInputChange(event) {
        setNewTask(event.target.value);
    }
    // Mit async und await Websitenaufruf Zeit geben und Userinputs an Backend-Server schicken.
    async function addTask() {
        if (newTask !== '') {
          await fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ task: newTask }),
          });
          fetchAllData();
          setNewTask("");  // muss rein sonst wird das Eingabefeld nicht gelöscht!
        }
    }
    // Mit async und await Websitenaufruf Zeit geben und Userinputs an Backend-Server schicken.
    async function moveTaskUp(index) {
        if (index > 0) {
            await fetch('http://localhost:3000/tasks/up', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ index }),
            });
            fetchAllData();
            
        }
    }
    // Mit async und await Websitenaufruf Zeit geben und Userinputs an Backend-Server schicken.
    async function moveTaskDown(index) {
        if (index < tasks.length -1) {
            await fetch('http://localhost:3000/tasks/down', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ index })
            });
            fetchAllData();
        }
    }
    // Mit async und await Websitenaufruf Zeit geben und Userinputs an Backend-Server schicken.
    async function deleteTask(index) {
    await fetch(`http://localhost:3000/tasks/${index}`, {
        method:"DELETE"
    })
        fetchAllData();
    // const updatedTasks = tasks.filter((task, i) => i !== index);
    // const updatedTasks = tasks.filter((_,i) => i !== index); // das Gleiche, wie oben in kurzer Schreibweise.
    }
    // Seite mit allen HTML-Komponenten aufbauen.
    return (
        <div className="to-do-list">
            <div>
                <input
                    type= "text"
                    placeholder="enter new task"
                    className="input-field"
                    value={newTask}
                    onChange={handleInputChange}
                />
                <button className="add-button" onClick={addTask}>
                    Add
                </button>
            </div>
            <div>
                <ol>
                    {tasks.map((task, index) => (
                        <li key={index} className="todo-item">
                            <span className="text">{task}</span>
                            <div className="buttons">
                                <button className="up-button" onClick={() => moveTaskUp(index)}>UP</button>
                                <button className="down-button" onClick={() => moveTaskDown(index)}>DOWN</button>
                                <button className="delete-button" onClick={() => deleteTask(index)}>DELETE</button>
                            </div>
                        </li>                        
                    ))}
                </ol>
            </div>
        </div>
    );
}

export default TodoList;