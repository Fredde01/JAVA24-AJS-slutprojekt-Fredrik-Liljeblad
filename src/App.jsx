import MemberForm from "./components/MemberForm";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./styles/style.css";

function App() {
  return (
    <div className="app-container">
      <h1>Scrum Board</h1>
      <MemberForm />
      <TaskForm />
      <TaskList />
    </div>
  );
}

export default App;
