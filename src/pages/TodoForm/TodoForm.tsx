import React from "react";
import { cn } from "../../lib/utils.ts";
import { Input } from "../../components/CustomInput/CustomInput.tsx";
import Button from "../../components/Button/Button.tsx";
import { useTodo } from "../../hooks/useTodo.ts";
import type { TodoType } from "../../types/types.ts";
import { toast } from "react-toastify";

const TodoForm: React.FC = () => {
  const {
    input,
    setInput,
    todos,
    setTodos,
    editId,
    setEditId,
    setIsChecked,
    debouncedSearch,
  } = useTodo();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setInput({
      ...input,
      [name]: type === "checkbox" ? checked : value,
    } as TodoType);
  };
  // Filter todos by debounced search term (reuse same behavior as context)
  const filteredData = todos.filter((item) =>
    item.todo.toLowerCase().includes(debouncedSearch.toLowerCase())
  );
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.todo.trim()) {
      toast.error("Please add the todo:)");
      return;
    }
    if (editId) {
      const updatedTodos = todos.map((item: TodoType) =>
        item.id === editId ? { ...item, todo: input.todo } : item
      );
      setTodos(updatedTodos);
      resetForm();
      showSubmissionMessage(true);
      return;
    }

    const newTodo: TodoType = {
      // Use a stable string id derived from current list length
      id: Date.now(),
      todo: input.todo,
      isCompleted: input.isCompleted,
    };

    const duplicateTodo = filteredData.find(
      (item) => item.todo.toLowerCase() === newTodo.todo.toLowerCase()
    );

    if (duplicateTodo) {
      toast.info("Todo already exists!");
      return;
    }

    setTodos([...todos, newTodo]);
    resetForm();
    showSubmissionMessage(false);
  };

  const resetForm = () => {
    setInput({
      todo: "",
      isCompleted: false,
    });
    setEditId(null);
    setIsChecked(false);
  };

  const showSubmissionMessage = (isUpdate: boolean) => {
    if (isUpdate) {
      toast.success("Updating your todo :)");
    } else {
      toast.success("Submitting your todo :)");
    }
  };
  return (
    <>
      <h1 className="text-4xl font-semibold text-center mb-5 font-sans">
        Task Management
      </h1>
      <form onSubmit={handleSubmit} className={cn("mb-6 flex gap-2")}>
        <Input
          type="text"
          placeholder="Add a new todo..."
          name="todo"
          value={input.todo}
          onChange={handleChange}
          aria-label="Add todo"
        />
        <Button
          type="submit"
          variant="primary"
          className="h-10 min-w-28 "
          size={"md"}
        >
          {editId ? "Update" : "Add"}
        </Button>
      </form>
    </>
  );
};

export default TodoForm;
