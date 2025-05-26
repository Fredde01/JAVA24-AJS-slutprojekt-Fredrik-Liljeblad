import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot, updateDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import TaskCard from "./TaskCard";
import "../styles/style.css"

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterMember, setFilterMember] = useState("");
  const [sortBy, setSortBy] = useState("");


  useEffect(() => {
    const unsubTasks = onSnapshot(collection(db, "assignments"), (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubMembers = onSnapshot(collection(db, "members"), (snapshot) => {
      setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubTasks();
      unsubMembers();
    };
  }, []);

  const handleAssign = async (task, memberId) => {
    const memberDoc = await getDoc(doc(db, "members", memberId));
    if (!memberDoc.exists()) return;

    const member = memberDoc.data();

    if (!member.categories.includes(task.category)) {
      alert("This member doesn't have the right category for this task.");
      return;
    }

    await updateDoc(doc(db, "assignments", task.id), {
      status: "in-progress",
      member: member.name,
    });
  };

  const handleComplete = async (task) => {
    await updateDoc(doc(db, "assignments", task.id), { status: "finished" });
  };

  const handleDelete = async (task) => {
    await deleteDoc(doc(db, "assignments", task.id));
  };

  const renderTasks = (status) => {
  let filtered = tasks.filter(task => task.status === status);

  
  if (status === "in-progress") {
    if (filterCategory) {
      filtered = filtered.filter(task => task.category === filterCategory);
    }

    if (filterMember) {
      filtered = filtered.filter(task => task.member === filterMember);
    }

    if (sortBy === "timestamp-asc") {
      filtered.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
    } else if (sortBy === "timestamp-desc") {
      filtered.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
    } else if (sortBy === "title-asc") {
      filtered.sort((a, b) => a.assignment.localeCompare(b.assignment));
    } else if (sortBy === "title-desc") {
      filtered.sort((a, b) => b.assignment.localeCompare(a.assignment));
    }
  }

  return filtered.map(task => {
    const eligibleMembers = members.filter(member =>
      member.categories.includes(task.category)
    );
    return (
      <TaskCard
        key={task.id}
        task={task}
        eligibleMembers={eligibleMembers}
        onAssign={handleAssign}
        onComplete={handleComplete}
        onDelete={handleDelete}
      />
    );
  });
};


 return (
  <div className="task-wrapper">
    <div className="task-container new">
      <h2>New</h2>
      {renderTasks("new")}
    </div>

    <div className="task-container in-progress">
      <h2>In Progress</h2>

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

    <div className="task-container finished">
      <h2>Finished</h2>
      {renderTasks("finished")}
    </div>
  </div>
);

}
