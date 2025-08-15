"use client";

import { useState, useEffect } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Clock, AlertTriangle, GripVertical } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { useAppDispatch } from "../hooks/redux-hooks";
import {
  type Todo,
  type TodoStatus,
  updateTodoStatus,
  deleteTodo,
} from "../store/todoSlice";
import { SetDueDateDialog } from "./set-due-date-dialog";
import { toast } from "react-toastify";

interface TodoCardProps {
  todo: Todo;
  index: number;
}

const statusColors = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800",
  ongoing:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-200 dark:border-orange-800",
  done: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800",
};

const statusOptions: Record<TodoStatus, TodoStatus[]> = {
  new: ["ongoing", "done"],
  ongoing: ["new", "done"],
  done: ["new", "ongoing"],
};

export function TodoCard({ todo, index }: TodoCardProps) {
  const dispatch = useAppDispatch();
  const [showDueDateDialog, setShowDueDateDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TodoStatus | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const isOverdue =
    todo.status === "ongoing" &&
    todo.dueDate &&
    new Date(todo.dueDate) < new Date();

  useEffect(() => {
    if (isOverdue) {
      toast.error(`"${todo.title}" is past its due date`);
    }
  }, [isOverdue, todo.title]);

  const handleStatusChange = (newStatus: TodoStatus) => {
    if (newStatus === "ongoing" && !todo.dueDate) {
      setPendingStatus(newStatus);
      setShowDueDateDialog(true);
    } else {
      dispatch(updateTodoStatus({ id: todo.id, status: newStatus }));
      toast.success(`Task moved to ${newStatus}`);
    }
  };

  const handleDueDateSet = (dueDate: string) => {
    if (pendingStatus) {
      dispatch(
        updateTodoStatus({
          id: todo.id,
          status: pendingStatus,
          dueDate,
        })
      );
      toast.success(`Task moved to ${pendingStatus} with due date set`);
      setPendingStatus(null);
    }
    setShowDueDateDialog(false);
  };

  const handleDelete = () => {
    dispatch(deleteTodo(todo.id));
    toast.success("Task has been removed");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Draggable draggableId={todo.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`transition-all duration-300 ease-out ${
              snapshot.isDragging
                ? "rotate-3 scale-105 shadow-2xl z-50"
                : isHovered
                ? "scale-[1.02] shadow-lg"
                : "shadow-sm"
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <ContextMenu>
              <ContextMenuTrigger>
                <Card
                  className={`cursor-pointer transition-all duration-200 ease-in-out border-l-4 ${
                    isOverdue
                      ? "ring-2 ring-red-500 border-l-red-500 bg-red-50 dark:bg-red-950/20"
                      : todo.status === "new"
                      ? "border-l-blue-500 hover:border-l-blue-600"
                      : todo.status === "ongoing"
                      ? "border-l-orange-500 hover:border-l-orange-600"
                      : "border-l-green-500 hover:border-l-green-600"
                  } ${
                    snapshot.isDragging
                      ? "bg-white dark:bg-slate-800 border-primary"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <CardContent className="p-4 relative">
                    <div
                      className={`absolute top-2 right-2 opacity-0 transition-opacity duration-200 ${
                        isHovered || snapshot.isDragging ? "opacity-30" : ""
                      }`}
                    >
                      <GripVertical className="h-4 w-4 text-slate-400" />
                    </div>

                    <div className="flex items-start justify-between mb-3">
                      <Badge
                        className={`${
                          statusColors[todo.status]
                        } transition-all duration-200 font-medium`}
                      >
                        {todo.status.charAt(0).toUpperCase() +
                          todo.status.slice(1)}
                      </Badge>
                      {isOverdue && (
                        <div className="flex items-center gap-1 text-red-500 animate-pulse">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-xs font-medium">Overdue</span>
                        </div>
                      )}
                    </div>

                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2 leading-tight">
                      {todo.title}
                    </h4>

                    {todo.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed">
                        {todo.description}
                      </p>
                    )}

                    <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span>Created: {formatDate(todo.createdAt)}</span>
                      </div>

                      {todo.dueDate && todo.status === "ongoing" && (
                        <div
                          className={`flex items-center gap-1.5 ${
                            isOverdue
                              ? "text-red-500 font-medium"
                              : "text-orange-600 dark:text-orange-400"
                          }`}
                        >
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span>Due: {formatDate(todo.dueDate)}</span>
                        </div>
                      )}

                      {todo.completedAt && (
                        <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span>Completed: {formatDate(todo.completedAt)}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </ContextMenuTrigger>

              <ContextMenuContent className="w-48">
                {statusOptions[todo.status].map((status) => (
                  <ContextMenuItem
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className="cursor-pointer transition-colors duration-150"
                  >
                    Move to {status.charAt(0).toUpperCase() + status.slice(1)}
                  </ContextMenuItem>
                ))}
                <ContextMenuItem
                  onClick={handleDelete}
                  className="text-red-600 dark:text-red-400 cursor-pointer transition-colors duration-150 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  Delete task
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>
        )}
      </Draggable>

      <SetDueDateDialog
        open={showDueDateDialog}
        onOpenChange={setShowDueDateDialog}
        onConfirm={handleDueDateSet}
        taskTitle={todo.title}
      />
    </>
  );
}
