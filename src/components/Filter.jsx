export function filterAndSortTasks(tasks, status, filterCategory, filterMember, sortBy, members) {
  // Filtrerar ut uppgifter som matchar den givna statusen (t.ex. "new", "in-progress", "finished")
  let filtered = tasks.filter(task => task.status === status);

  // Om status är "in-progress" tillämpas ytterligare filter och sortering
  if (status === "in-progress") {
    // Filtrera på kategori om filterCategory är satt (inte tomt)
    if (filterCategory) {
      filtered = filtered.filter(task => task.category === filterCategory);
    }

    // Filtrera på ansvarig medlem om filterMember är satt (inte tomt)
    if (filterMember) {
      filtered = filtered.filter(task => task.member === filterMember);
    }

    // Sortera listan baserat på valt sorteringskriterium
    if (sortBy === "timestamp-asc") {
      // Sortera så att äldsta (lägsta timestamp) kommer först
      filtered.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
    } else if (sortBy === "timestamp-desc") {
      // Sortera så att nyaste (högsta timestamp) kommer först
      filtered.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
    } else if (sortBy === "title-asc") {
      // Sortera uppgifterna i bokstavsordning A–Ö baserat på uppgiftens titel (assignment)
      filtered.sort((a, b) => a.assignment.localeCompare(b.assignment));
    } else if (sortBy === "title-desc") {
      // Sortera uppgifterna i omvänd bokstavsordning Ö–A
      filtered.sort((a, b) => b.assignment.localeCompare(a.assignment));
    }
  }

  // Skapar och returnerar en ny array med objekt som innehåller:
  // - task: själva uppgiften
  // - eligibleMembers: en lista med medlemmar som har rätt kategori för uppgiften
  return filtered.map(task => {
    // Filtrerar medlemmar som har kategori som matchar uppgiftens kategori
    const eligibleMembers = members.filter(member =>
      member.categories.includes(task.category)
    );
    return { task, eligibleMembers };
  });
}
