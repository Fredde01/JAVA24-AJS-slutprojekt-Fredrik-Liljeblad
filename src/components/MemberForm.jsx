import { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";

const roles = ["Ux", "Frontend", "Backend"];

export default function MemberForm() {
  const [name, setName] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);

  function handleRoleChange(role) {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Give the member a name");
      return;
    }
    if (selectedRoles.length === 0) {
      alert("Pick at least one role");
      return;
    }

    try {
      await addDoc(collection(db, "members"), {
        name,
        categories: selectedRoles
      });
      alert("Member added!");
      setName("");
      setSelectedRoles([]);
    } catch (error) {
      alert("Error when adding: " + error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
    <div className="fieldset-wrapper">
        <legend>Roles</legend>
    <fieldset>
      <label>
        Name:
        <input type="text" value={name} onChange={e => setName(e.target.value)} />
      </label>

    
        {roles.map(role => (
          <label key={role}>
            <input type="checkbox" checked={selectedRoles.includes(role)} onChange={() => handleRoleChange(role)} />
            {role}
          </label>
        ))}

      <button type="submit">Add member</button>
      </fieldset>
      </div> 
    </form>
  );
}
