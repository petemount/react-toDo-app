const express = require ("express");
//const bodyParser = require('body-parser');
const app = express();
// Für den Api-Kontakt zum Frontend benötigen wir cors für die Berechtigung Daten auszutauschen.
const cors = require ('cors')
// Ggf. die PORT-Variable anpassen, falls ein Port nicht verfügbar ist oder diesen überprüfen und ggf. killen.
const PORT = 3000;
const fs = require("fs")

// Aufruf des core für die Frontoffice-Verbindung
app.use(cors());
// Aufruf express für das json-Daten-Format und das der Body geparst wird
app.use(express.json());

// Funktion zum Einlesen der ausgelagerten DB-Simulations-Datei tasks.json!
function getTasks(){
    const data = fs.readFileSync("./tasks.json")
    return JSON.parse(data)
}

// Funktion zum Sichern manipulierter Daten infolge del.-, up-, -down-Buttons
function saveTasks(tasks) {
    fs.writeFileSync("./tasks.json",JSON.stringify(tasks, null, 2))
}

// Die Middleware für den Body, damit dieser im JSON Format gelesen u. gepostet werden kann ist
// Überflüssig --> kommt mit express! bodyParser braucht man nicht mehr.
// Middelware für urlencoded Infos, falls von mir/Backoffice-Bereich zugelassen.
// app.use(bodyParser.urlencoded({ extended: true }));


// Hole mir alle Tasks
app.get("/tasks", (req,res) => {
    let tasks = getTasks()
    res.json(tasks);
});

// Ermittelt ein bestimmtes Element aus der Task-Liste, 
// Via Postman ../tasks/<indexnr> oder als Suffix in der URL, falls im Browser betrachtet.
app.get("/tasks/:index", (req,res) => {
    let tasks = getTasks()
    const index = parseInt(req.params.index);
    if (index >= 0 && index < tasks.length){
    const task = tasks.find((t,i) => i === index);
    res.json(task)
    }
});

// Neue Einträge über "task" hinzufügen, egal, was im Body sonst noch steht
app.post("/tasks", (req,res) => {
    let tasks = getTasks()
    const newTask = req.body.task;
    if (newTask) {
        tasks.push(newTask)
        res
        .status(201)
        .send({ message: "Dein Task wurde erfolgreich hinzugefügt"})
        saveTasks(tasks)
    } else {
        res
        .status(400)
        .send({message:"Bitte einen Task in Form von {'task':'neuer task'} hinzufügen",});
    }    
});

// Move task up Funktion eingebaut
app.post('/tasks/up', (req, res) => {
    const tasks = getTasks()
    const { index } = req.body;
    if (index > 0 && index < tasks.length ) {
        [tasks[index], tasks[index -1]] = [tasks[index -1], tasks[index]];
        saveTasks(tasks)
        res.json({ message: 'Task erfolgreich nach oben verschoben. '});
    } else {
        res.status(400).json({ message: 'Invalid Index' });
    } 
});

// Move task down Funktion eingebaut
app.post('/tasks/down', (req, res) => {
    const tasks = getTasks()
    const { index } = req.body;
    if (index >= 0 && index < tasks.length -1) {
        [tasks[index], tasks[index +1]] = [tasks[index +1], tasks[index]];
        saveTasks(tasks)
        res.json({ message: 'Task erfolgreich nach unten verschoben. '});
    } else {
        res.status(400).json({ message: 'Invalid Index' });
    } 
});


// Delete-Funktion eingebaut
app.delete("/tasks/:index", (req,res) => {
    let tasks = getTasks()
// <parseInt> ist notwendig, da <.params> als String gespeichert werden!
    const index = parseInt(req.params.index);
    if (index >= 0 && index < tasks.length){
        tasks = tasks.filter((task,i) => i !== index);
        res.json({message: "Task wurde erfolgreich gelöscht"})
        saveTasks(tasks)
}   else {
        res.status(400).json({message: "Bitte einen gültigen Index angeben"})}
});


// Port auf API-Anfragen überwachen.
app.listen(PORT, () => {
    console.log(`Der Server wurde gestartet. Port: ${PORT}`)
});