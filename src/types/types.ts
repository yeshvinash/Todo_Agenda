export interface TodoType {
  id?: number | null;
  todo: string;
  isCompleted: boolean;
}

// Add type for input, matching useState<Omit<TodoType, "id">>
export type TodoInputType = Omit<TodoType, "id">;

export interface Todo {
  todos: TodoType[];
  filteredData: TodoType[];
  sortBy: string;
  setSortBy: (value: string) => void;
  setTodos: (todos: TodoType[] | ((prev: TodoType[]) => TodoType[])) => void;
  toggleComplete: (id?: number | null) => void;
  deleteTodo: (id?: number | null) => void;
  deleteCompletedTodo: () => void;
  deleteAllTodos: () => void;
  editTodo: (id: number | null) => void;
  getSortedTodos: () => TodoType[];
  editId: number | null;
  setEditId: (value: number | null) => void;
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
  debouncedSearch: string;
  setDebouncedSearch: (value: string) => void;
  search: string;
  setSearch: (value: string) => void;
  input: TodoInputType;
  setInput: (value: TodoInputType) => void;
}

export interface TodoContextType {
  children: React.ReactNode;
}
