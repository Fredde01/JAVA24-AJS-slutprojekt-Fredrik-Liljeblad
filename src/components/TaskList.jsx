// Hooks från React
import { useEffect, useState } from "react";

// Firebase Firestore och config
import { db } from "../firebase/config";
import { collection, onSnapshot, updateDoc, doc, deleteDoc, getDoc } from "firebase/firestore";

// TaskCard-komponenten för att rendera varje uppgift
import TaskCard from "./TaskCard";
import "../styles/style.css"; 
import { filterAndSortTasks } from "./filter";

export default function TaskList() {
  // State för att lagra uppgifter och medlemmar
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);

  // State för filtrering och sortering
  const [filterCategory, setFilterCategory] = useState("");
  const [filterMember, setFilterMember] = useState("");
  const [sortBy, setSortBy] = useState("");

  // useEffect körs när komponenten mountas
  useEffect(() => {
    // Lyssna på ändringar i "assignments"-samlingen
    const unsubTasks = onSnapshot(collection(db, "assignments"), (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Lyssna på ändringar i "members"-samlingen
    const unsubMembers = onSnapshot(collection(db, "members"), (snapshot) => {
      setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Avsluta prenumerationerna när komponenten tas bort
    return () => {
      unsubTasks();
      unsubMembers();
    };
  }, []);

  // Funktion för att tilldela medlem till uppgift
  const handleAssign = async (task, memberId) => {
    const memberDoc = await getDoc(doc(db, "members", memberId));
    if (!memberDoc.exists()) return;

    const member = memberDoc.data();

    // Säkerställ att medlemmen har rätt kategori för uppgiften
    if (!member.categories.includes(task.category)) {
      alert("This member doesn't have the right category for this task.");
      return;
    }

    // Uppdatera uppgiften med "in-progress" status och tilldelad medlem
    await updateDoc(doc(db, "assignments", task.id), {
      status: "in-progress",
      member: member.name,
    });
  };

  // Markera uppgift som färdig
  const handleComplete = async (task) => {
    await updateDoc(doc(db, "assignments", task.id), { status: "finished" });
  };

  // Ta bort uppgift
  const handleDelete = async (task) => {
    await deleteDoc(doc(db, "assignments", task.id));
  };

  // Filtrera och sortera uppgifter
  const renderTasks = (status) => {
    const filteredTasksWithMembers = filterAndSortTasks (tasks, status, filterCategory, filterMember, sortBy, members);
     
    
    return filteredTasksWithMembers.map(({ task, eligibleMembers }) => (


      <TaskCard
        key={task.id}
        task={task}
        eligibleMembers={eligibleMembers}
        onAssign={handleAssign}
        onComplete={handleComplete}
        onDelete={handleDelete}
      />
    ));
  };

  return (
    <div className="task-wrapper">
      {/* Uppgifter med status: new */}
      <div className="task-container new">
        <h2>New</h2>
        {renderTasks("new")}
      </div>

      {/* Uppgifter med status: in-progress + filter */}
      <div className="task-container in-progress">
        <h2>In Progress</h2>

        {/* Filtrering och sortering */}
        <div className="filters">
          <label>
            Category:
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="">All</option>
              <option value="Ux">Ux</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
            </select>
          </label>

          <label>
            Member:
            <select value={filterMember} onChange={(e) => setFilterMember(e.target.value)}>
              <option value="">All</option>
              {members.map(member => (
                <option key={member.id} value={member.name}>{member.name}</option>
              ))}
            </select>
          </label>

          <label>
            Sort by:
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="">None</option>
              <option value="timestamp-desc">Newest first</option>
              <option value="timestamp-asc">Oldest first</option>
              <option value="title-asc">Title A–Z</option>
              <option value="title-desc">Title Z–A</option>
            </select>
          </label>
        </div>

        {renderTasks("in-progress")}
      </div>

      {/* Uppgifter med status: finished */}
      <div className="task-container finished">
        <h2>Finished</h2>
        {renderTasks("finished")}
      </div>
    </div>
  );
}
