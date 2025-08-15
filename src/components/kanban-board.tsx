"use client";

import { useState } from "react";
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import {
  updateTodoStatus,
  reorderTodos,
  type TodoStatus,
} from "../store/todoSlice";
import { KanbanColumn } from "./kanban-column";
import { AddTodoDialog } from "./add-todo-dialog";
import { SetDueDateDialog } from "./set-due-date-dialog";
import { OverdueAlert } from "./overdue-alert";
import { toast } from "react-toastify";

const columns: {
  id: TodoStatus;
  title: string;
  color: string;
  bgColor: string;
}[] = [
  {
    id: "new",
    title: "New",
    color: "bg-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    id: "ongoing",
    title: "Ongoing",
    color: "bg-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
  },
  {
    id: "done",
    title: "Done",
    color: "bg-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
  },
];

export function KanbanBoard() {
  const dispatch = useAppDispatch();
  const todos = useAppSelector((state) => state.todos.todos);
  const [dueDateDialog, setDueDateDialog] = useState<{
    open: boolean;
    todoId: string;
    taskTitle: string;
  }>({
    open: false,
    todoId: "",
    taskTitle: "",
  });

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceStatus = source.droppableId as TodoStatus;
    const destinationStatus = destination.droppableId as TodoStatus;

    if (sourceStatus === destinationStatus) {
      dispatch(
        reorderTodos({
          sourceIndex: source.index,
          destinationIndex: destination.index,
          sourceStatus,
          destinationStatus,
          todoId: draggableId,
        })
      );
    } else {
      if (destinationStatus === "ongoing") {
        const todo = todos.find(
          (t: (typeof todos)[number]) => t.id === draggableId
        );
        if (todo) {
          setDueDateDialog({
            open: true,
            todoId: draggableId,
            taskTitle: todo.title,
          });
        }
      } else {
        dispatch(
          updateTodoStatus({ id: draggableId, status: destinationStatus })
        );
        toast.success(`Task moved to ${destinationStatus} column`);
      }
    }
  };

  const handleDueDateConfirm = (dueDate: string) => {
    dispatch(
      updateTodoStatus({
        id: dueDateDialog.todoId,
        status: "ongoing",
        dueDate,
      })
    );
    toast.success(`Due date set for ${new Date(dueDate).toLocaleString()}`);
  };

  return (
    <div className="w-full">
      <OverdueAlert />

      <div className="mb-8 flex justify-center">
        <AddTodoDialog />
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[600px] rounded-xl border-2 transition-all duration-300 ease-in-out ${
                    snapshot.isDraggingOver
                      ? "border-primary bg-primary/10 shadow-lg scale-[1.02]"
                      : `border-slate-200 dark:border-slate-700 ${column.bgColor}`
                  }`}
                >
                  <KanbanColumn
                    column={column}
                    todos={todos.filter(
                      (todo: (typeof todos)[number]) =>
                        todo.status === column.id
                    )}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <SetDueDateDialog
        open={dueDateDialog.open}
        onOpenChange={(open) => setDueDateDialog((prev) => ({ ...prev, open }))}
        onConfirm={handleDueDateConfirm}
        taskTitle={dueDateDialog.taskTitle}
      />
    </div>
  );
}
