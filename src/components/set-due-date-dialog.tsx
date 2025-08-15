"use client";

import { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

interface SetDueDateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (dueDate: string) => void;
  taskTitle: string;
}

export function SetDueDateDialog({
  open,
  onOpenChange,
  onConfirm,
  taskTitle,
}: SetDueDateDialogProps) {
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("12:00");

  const handleConfirm = () => {
    if (!dueDate) return;

    const dateTime = new Date(`${dueDate}T${dueTime}:00`);
    onConfirm(dateTime.toISOString());
    setDueDate("");
    setDueTime("12:00");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setDueDate("");
    setDueTime("12:00");
    onOpenChange(false);
  };

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  if (open && !dueDate) {
    setDueDate(tomorrow);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Set Due Date for Task
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <p className="font-medium text-orange-800 dark:text-orange-200 mb-1">
              Moving to Ongoing:
            </p>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              "{taskTitle}"
            </p>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400">
            Set a due date to track progress and receive overdue alerts if
            needed.
          </p>

          <div className="space-y-2">
            <Label htmlFor="due-date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              Due Date
            </Label>
            <Input
              id="due-date"
              type="date"
              value={dueDate}
              min={today}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full transition-all duration-200 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="due-time" className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              Due Time
            </Label>
            <Input
              id="due-time"
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="w-full transition-all duration-200 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {dueDate && (
            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded border text-sm">
              <span className="text-slate-600 dark:text-slate-400">Due: </span>
              <span className="font-medium">
                {new Date(`${dueDate}T${dueTime}:00`).toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!dueDate}
              className="bg-orange-500 hover:bg-orange-600 transition-all duration-200"
            >
              Set Due Date & Move
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
