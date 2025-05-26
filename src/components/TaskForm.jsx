import { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const categories = ["Ux", "Frontend", "Backend"];

export default function TaskForm() {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState(categories[0]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!task.trim()) {
      alert("Write a task");
      return;
    }

    try {
      await addDoc(collection(db, "assignments"), {
        assignment: task,
        category,
        status: "new",
        timestamp: serverTimestamp()
      });
      alert("Task added!");
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
      <label> Task: <input type="text" value={task} onChange={e => setTask(e.target.value)}/></label>

      <label> 
        Category: 
        <select value={category} onChange={e => setCategory(e.target.value)}>
           {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat.toUpperCase()}
            </option>
          ))}
        </select>
      </label>

      <button type="submit">Add task</button>
      </fieldset>
      </div>
    </form>
  );
}
