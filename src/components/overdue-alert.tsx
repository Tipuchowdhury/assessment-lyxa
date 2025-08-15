"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { useAppSelector } from "../hooks/redux-hooks";

type Todo = {
  id: string;
  title: string;
  status: string;
  dueDate?: string;
};

export function OverdueAlert() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const todos = useAppSelector((state) => state.todos.todos);

  const overdueTodos = todos.filter((todo: Todo) => {
    if (todo.status !== "ongoing" || !todo.dueDate) return false;
    const now = new Date();
    const dueDate = new Date(todo.dueDate);
    return dueDate < now && !dismissed.includes(todo.id);
  });

  const handleDismiss = (todoId: string) => {
    setDismissed((prev) => [...prev, todoId]);
  };

  useEffect(() => {
    const currentOverdueIds = todos
      .filter(
        (todo: Todo) =>
          todo.status === "ongoing" &&
          todo.dueDate &&
          new Date(todo.dueDate) < new Date()
      )
      .map((todo: Todo) => todo.id);

    setDismissed((prev) => prev.filter((id) => currentOverdueIds.includes(id)));
  }, [todos]);

  if (overdueTodos.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {overdueTodos.map((todo: Todo) => (
        <Alert
          key={todo.id}
          className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 shadow-lg animate-in slide-in-from-right-full duration-300"
        >
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="pr-8">
            <div className="space-y-1">
              <p className="font-semibold text-red-800 dark:text-red-200">
                Task Overdue!
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                {todo.title}
              </p>
              <p className="text-xs text-red-600 dark:text-red-400">
                Due: {new Date(todo.dueDate!).toLocaleString()}
              </p>
            </div>
          </AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-6 w-6 p-0 text-red-600 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900"
            onClick={() => handleDismiss(todo.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Alert>
      ))}
    </div>
  );
}
