import React, { useState, useEffect, useCallback, useMemo } from "react";
import type { TodoContextType, TodoType } from "../types/types";
import { TodoContext } from "./TodoContext.ts";
import { toast } from "react-toastify/unstyled";

// Keep initial state simple and pure
const INITIAL_TODOS: TodoType[] = [];

const STORAGE_KEY = "todo";

export const TodoContextProvider: React.FC<TodoContextType> = ({
  children,
}) => {
  // Initialize from localStorage once, outside of render path side effects
  const [todos, setTodos] = useState<TodoType[]>(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      return savedData ? (JSON.parse(savedData) as TodoType[]) : INITIAL_TODOS;
    } catch {
      return INITIAL_TODOS;
    }
  });
  const [input, setInput] = useState<Omit<TodoType, "id">>({
    todo: "",
    isCompleted: false,
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  // Persist todos to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // fail silently – storage is a best‑effort enhancement
    }
  }, [todos]);

  // Filter todos by debounced search term
  const filteredData = useMemo(
    () =>
      todos.filter((item) =>
        item.todo.toLowerCase().includes(debouncedSearch.toLowerCase())
      ),
    [todos, debouncedSearch]
  );

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const toggleComplete = useCallback(
    (id?: number | null) => {
      if (id == null) return;
      setTodos((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
        )
      );
      setIsChecked(true);
    },
    [setTodos]
  );

  const deleteTodo = useCallback(
    (id?: number | null) => {
      if (id == null) return;
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this todo?"
      );
      if (!confirmDelete) return;
      setTodos((prev) => prev.filter((item) => item.id !== id));
      toast.error("Your todo has been successfully deleted!");
    },
    [setTodos]
  );

  const deleteCompletedTodo = useCallback(() => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete selected todo items?"
    );
    if (!confirmDelete) return;

    if (isChecked) {
      setTodos((prev) => prev.filter((item) => !item.isCompleted));
    }
    setIsChecked(false);
    toast.error("Your selected todo has been successfully deleted!");
  }, [isChecked, setTodos]);

  const deleteAllTodos = useCallback(() => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all todo items?"
    );
    if (!confirmDelete) return;
    setTodos([]);
  }, [setTodos]);

  const editTodo = useCallback(
    (id: number | null) => {
      if (id == null) return;
      const findTodo = filteredData.find((item: TodoType) => item.id === id);
      if (!findTodo) return;
      setInput({ todo: findTodo.todo, isCompleted: findTodo.isCompleted });
      setEditId(id);
    },
    [filteredData]
  );

  const getSortedTodos = useCallback((): TodoType[] => todos, [todos]);

  return (
    <TodoContext.Provider
      value={{
        todos,
        sortBy,
        setSortBy,
        setTodos,
        toggleComplete,
        deleteTodo,
        deleteCompletedTodo,
        deleteAllTodos,
        editTodo,
        getSortedTodos,
        debouncedSearch,
        setDebouncedSearch,
        editId,
        setEditId,
        isChecked,
        setIsChecked,
        search,
        setSearch,
        filteredData,
        input,
        setInput,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
