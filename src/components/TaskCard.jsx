import "../styles/style.css"

export default function TaskCard({ task, eligibleMembers = [], onAssign, onComplete, onDelete }) {
  return (
    <div className="task-card">
      <div><strong>Task:</strong> {task.assignment}</div>
      <div><strong>Category:</strong> {task.category}</div>
      <div><strong>Created:</strong> {new Date(task.timestamp?.seconds * 1000).toLocaleString()}</div>
      {task.member && <div><strong>Responsible:</strong> {task.member}</div>}

      {task.status === "new" && (
        <select onChange={(e) => onAssign(task, e.target.value)} defaultValue=""className="assign-select">
          <option value="" disabled>Choose responsible</option>
          {eligibleMembers.map((member) => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>
      )}

      {task.status === "in-progress" && (
        <button onClick={() => onComplete(task)} className="complete-button" >Mark as finished </button>
      )}

      {task.status === "finished" && (
        <button onClick={() => onDelete(task)} className="delete-button" > Delete task</button>
      )}
    </div>
  );
}
