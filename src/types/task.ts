export type TaskStatus = 'pending' | 'completed' | 'overdue';
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  dueTime?: string;
  status: TaskStatus;
  recurrence: RecurrenceType;
  customMonthDuration?: number; // For custom recurrence (e.g., every 2 months)
  recurrenceEndDate?: string; // When recurring reminders should stop
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  lastNotified?: string; // Track when last notification was sent
}
