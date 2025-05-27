// React hook för state-hantering
import { useState } from "react";

// Importerar Firebase-databasens konfiguration
import { db } from "../firebase/config";

// Funktioner från Firestore: skapa dokument och hämta serverns timestamp
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Fördefinierade kategorier som kan användas i formuläret
const categories = ["Ux", "Frontend", "Backend"];

// Huvudkomponenten TaskForm
export default function TaskForm() {
  // State för texten i uppgiften
  const [task, setTask] = useState("");

  // State för vilken kategori som valts – börjar med första i listan
  const [category, setCategory] = useState(categories[0]);

  // Funktion som körs när formuläret skickas
  async function handleSubmit(e) {
    e.preventDefault(); // Förhindrar att sidan laddas om

    // Om task är tom, visa ett meddelande
    if (!task.trim()) {
      alert("Write a task");
      return;
    }

    try {
      // Skickar uppgiften till Firestore
      await addDoc(collection(db, "assignments"), {
        assignment: task,           // Själva uppgiften
        category,                   // Vald kategori
        status: "new",              // Standardstatus
        timestamp: serverTimestamp() // Tidsstämpel från servern
      });

      alert("Task added!");

      // Nollställer formuläret efter att uppgiften lagts till
      setTask("");
      setCategory(categories[0]);

    } catch (error) {
      alert("Error when adding: " + error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="fieldset-wrapper">
        <legend>Tasks</legend>
        <fieldset>
          {/* Inputfält för själva uppgiftens text */}
          <label>
            Task:
            <input
              type="text"
              value={task}                            // Kopplad till task-state
              onChange={e => setTask(e.target.value)} // Uppdaterar state när användaren skriver
            />
          </label>

          {/* Dropdown för att välja kategori */}
          <label>
            Category:
            <select
              value={category}                        // Kopplad till category-state
              onChange={e => setCategory(e.target.value)} // Uppdaterar state vid val
            >
              {/* Loopar igenom kategorierna och skapar ett <option> för varje */}
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.toUpperCase()}  {/* Visar i versaler */}
                </option>
              ))}
            </select>
          </label>

          {/* Knapp för att skicka formuläret */}
          <button type="submit">Add task</button>
        </fieldset>
      </div>
    </form>
  );
}
