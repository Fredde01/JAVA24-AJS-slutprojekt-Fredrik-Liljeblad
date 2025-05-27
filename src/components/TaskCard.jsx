// Importerar CSS för styling
import "../styles/style.css";

// Definierar komponenten TaskCard
// Tar emot en uppgift (task), lista med godkända medlemmar (eligibleMembers),
// samt funktioner för att hantera tilldelning, slutförande och borttagning
export default function TaskCard({ task, eligibleMembers = [], onAssign, onComplete, onDelete }) {
  return (
    // Yttre container för kortet
    <div className="task-card">
      {/* Visar uppgiftens titel */}
      <div><strong>Task:</strong> {task.assignment}</div>

      {/* Visar vilken kategori uppgiften tillhör */}
      <div><strong>Category:</strong> {task.category}</div>

      {/* Visar när uppgiften skapades, formaterad till lokal tid */}
      <div><strong>Created:</strong> {new Date(task.timestamp?.seconds * 1000).toLocaleString()}</div>

      {/* Om uppgiften har en tilldelad medlem, visa dennes namn */}
      {task.member && <div><strong>Responsible:</strong> {task.member}</div>}

      {/* Om uppgiften är ny: visa en dropdown för att tilldela den till en medlem */}
      {task.status === "new" && (
        <select
          onChange={(e) => onAssign(task, e.target.value)}  // När ett val görs, kör onAssign
          defaultValue=""                                    // Tomt val som standard
          className="assign-select"
        >
          <option value="" disabled>Choose responsible</option>
          {/* Lista ut alla möjliga medlemmar och visa i listan */}
          {eligibleMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      )}

      {/* Om uppgiften är i pågående status: visa knapp för att markera den som klar */}
      {task.status === "in-progress" && (
        <button
          onClick={() => onComplete(task)}  // Kör onComplete-funktionen med aktuell uppgift
          className="complete-button"
        >
          Mark as finished
        </button>
      )}

      {/* Om uppgiften är färdig: visa knapp för att ta bort uppgiften */}
      {task.status === "finished" && (
        <button
          onClick={() => onDelete(task)}  // Kör onDelete-funktionen
          className="delete-button"
        >
          Delete task
        </button>
      )}
    </div>
  );
}
