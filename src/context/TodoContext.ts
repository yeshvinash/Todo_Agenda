import { createContext } from "react";
import type { Todo } from "../types/types";

export const TodoContext = createContext<Todo | null>(null);
