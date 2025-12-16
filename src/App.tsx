import TodoForm from "./pages/TodoForm/TodoForm";
import TodoTable from "./pages/TodoTable/TodoTable";

const App = () => {
  return (
    <main className="max-w-5xl mx-auto">
      <TodoForm />
      <TodoTable />
    </main>
  );
};

export default App;
