import React, { useState } from "react";

function TodoList() {
    const [tasks, setTasks] = useState(['eat', 'sleep', 'code', 'repeate']);

    const [newTask, setNewtask] = useState('');

    function handleInputChange(event) {
        setNewtask(event.target.value)
    }

    function addTask(){
        if (newTask !== '') {
            setTasks((t) => [...tasks, newTask])
            setNewtask("")
        }
    }

    function moveTaskUp(index) {
        if (index > 0) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index-1]] = [
                updatedTasks[index -1],
                updatedTasks[index],
            ];
            setTasks(updatedTasks);
        }
    }

    function moveTaskDown(index) {
        if (index < tasks.length -1) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index + 1]] = [
                updatedTasks[index + 1], 
                updatedTasks[index]
            ];
            setTasks(updatedTasks);
        }

    }

    function deleteTask(index) {
    // const updatedTasks = tasks.filter((task, i) => i !== index);
    const updatedTasks = tasks.filter((_,i) => i !== index); // das Gleiche, wie oben in kurzer Schreibweise.
    setTasks(updatedTasks);
    }

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