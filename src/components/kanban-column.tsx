"use client";

import type { TodoStatus, Todo } from "../store/todoSlice";
import { TodoCard } from "./todo-card";

interface KanbanColumnProps {
  column: { id: TodoStatus; title: string; color: string };
  todos: Todo[];
}

export function KanbanColumn({ column, todos }: KanbanColumnProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className={`${column.color} text-white p-4`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{column.title}</h3>
          <span className="bg-white/20 text-white text-sm px-2 py-1 rounded-full">
            {todos.length}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {todos.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <p className="text-sm">No tasks in {column.title.toLowerCase()}</p>
          </div>
        ) : (
          todos.map((todo, index) => (
            <TodoCard key={todo.id} todo={todo} index={index} />
          ))
        )}
      </div>
    </div>
  );
}
