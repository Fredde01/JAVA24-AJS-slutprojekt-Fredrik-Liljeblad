// Importerar useState för att kunna hantera lokalt state i komponenten
import { useState } from "react";
// Importerar Firebase-konfiguration
import { db } from "../firebase/config";
// Importerar funktioner för att lägga till dokument i Firestore
import { collection, addDoc } from "firebase/firestore";

// En lista över roller som användaren kan välja
const roles = ["Ux", "Frontend", "Backend"];

export default function MemberForm() {
  // State för det ifyllda namnet
  const [name, setName] = useState("");
  // State för vilka roller som är valda (checkboxar)
  const [selectedRoles, setSelectedRoles] = useState([]);

  // Funktion som körs när en checkbox (roll) klickas
  function handleRoleChange(role) {
    if (selectedRoles.includes(role)) {
      // Om rollen redan är vald: ta bort den från listan
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      // Om rollen inte är vald: lägg till den
      setSelectedRoles([...selectedRoles, role]);
    }
  }

  // Funktion som körs när formuläret skickas in
  async function handleSubmit(e) {
    e.preventDefault(); // Förhindrar att sidan laddas om

    // Kontrollera att namn är ifyllt
    if (!name.trim()) {
      alert("Give the member a name");
      return;
    }

    // Kontrollera att minst en roll har valts
    if (selectedRoles.length === 0) {
      alert("Pick at least one role");
      return;
    }

    try {
      // Lägg till medlem i Firestore-databasen
      await addDoc(collection(db, "members"), {
        name: name,                   // Sparar namnet
        categories: selectedRoles     // Sparar valda roller
      });

      alert("Member added!");

      // Töm fälten efter inskick
      setName("");
      setSelectedRoles([]);
    } catch (error) {
      alert("Error when adding: " + error.message);
    }
  }

  return (
    // Formulär som kör handleSubmit när det skickas
    <form onSubmit={handleSubmit}>
      <div className="fieldset-wrapper">
    
        <legend>Roles</legend>

        <fieldset>
          
          <label>
            Name:
            <input
              type="text"
              // Kopplar värdet till state
              value={name}     
              // Uppdaterar name när man skriver                  
              onChange={e => setName(e.target.value)} 
            />
          </label>

          {roles.map(role => (
            <label key={role}>
              <input
                type="checkbox"
                // Visar som förbockad om rollen finns i state
                checked={selectedRoles.includes(role)}  
                // Hanterar val/avval av roll
                onChange={() => handleRoleChange(role)} 
              />
              {role}
            </label>
          ))}

          {/* Knapp för att skicka formuläret */}
          <button type="submit">Add member</button>
        </fieldset>
      </div>
    </form>
  );
}
