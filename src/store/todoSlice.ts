import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TodoStatus = "new" | "ongoing" | "done";

export interface Todo {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;
  createdAt: string;
  dueDate?: string;
  completedAt?: string;
  movedToOngoingAt?: string;
}

interface TodoState {
  todos: Todo[];
}

const loadTodosFromStorage = (): Todo[] => {
  const stored = localStorage.getItem("todos");
  return stored ? JSON.parse(stored) : [];
};

const saveTodosToStorage = (todos: Todo[]) => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const initialState: TodoState = {
  todos: loadTodosFromStorage().length
    ? loadTodosFromStorage()
    : [
        {
          id: "1",
          title: "Design System Setup",
          description:
            "Create a comprehensive design system with components, colors, and typography guidelines.",
          status: "new",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "API Integration",
          description:
            "Integrate with external APIs for data fetching and user authentication.",
          status: "ongoing",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          movedToOngoingAt: new Date().toISOString(),
          dueDate: new Date(Date.now() + 172800000).toISOString(),
        },
        {
          id: "3",
          title: "User Testing",
          description:
            "Conduct comprehensive user testing sessions and gather feedback.",
          status: "done",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          completedAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Omit<Todo, "id" | "createdAt">>) => {
      const newTodo: Todo = {
        ...action.payload,
        id: `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        status: "new",
      };
      state.todos.push(newTodo);
      saveTodosToStorage(state.todos);
    },
    updateTodoStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: TodoStatus;
        dueDate?: string;
      }>
    ) => {
      const todo = state.todos.find((t) => t.id === action.payload.id);
      if (todo) {
        todo.status = action.payload.status;
        if (action.payload.status === "ongoing") {
          todo.movedToOngoingAt = new Date().toISOString();
          if (action.payload.dueDate) {
            todo.dueDate = action.payload.dueDate;
          }
        } else if (action.payload.status === "done") {
          todo.completedAt = new Date().toISOString();
        }
        saveTodosToStorage(state.todos);
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      saveTodosToStorage(state.todos);
    },
    reorderTodos: (
      state,
      action: PayloadAction<{
        sourceIndex: number;
        destinationIndex: number;
        sourceStatus: TodoStatus;
        destinationStatus: TodoStatus;
        todoId: string;
      }>
    ) => {
      const { sourceIndex, destinationIndex, sourceStatus, destinationStatus } =
        action.payload;

      if (sourceStatus === destinationStatus) {
        const todosInColumn = state.todos.filter(
          (todo) => todo.status === sourceStatus
        );
        const [movedTodo] = todosInColumn.splice(sourceIndex, 1);
        todosInColumn.splice(destinationIndex, 0, movedTodo);

        const otherTodos = state.todos.filter(
          (todo) => todo.status !== sourceStatus
        );
        state.todos = [...otherTodos, ...todosInColumn];
      }
      saveTodosToStorage(state.todos);
    },
  },
});

export const { addTodo, updateTodoStatus, deleteTodo, reorderTodos } =
  todoSlice.actions;
export default todoSlice.reducer;
