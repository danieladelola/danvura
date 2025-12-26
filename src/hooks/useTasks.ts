import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus, RecurrenceType } from '@/types/task';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');

      const data = await response.json();

      const mappedTasks: Task[] = data.map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description || undefined,
        dueDate: task.dueDate,
        dueTime: task.dueTime || undefined,
        status: task.status as TaskStatus,
        recurrence: task.recurrence as RecurrenceType,
        customMonthDuration: task.customMonthDuration || undefined,
        recurrenceEndDate: task.recurrenceEndDate || undefined,
        completedAt: task.completedAt || undefined,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        lastNotified: task.lastNotified || undefined,
      }));

      setTasks(mappedTasks);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Update task statuses based on due dates
  const updateTaskStatuses = useCallback(async () => {
    const now = new Date();
    const tasksToUpdate = tasks.filter(task => {
      if (task.status === 'completed') return false;
      const dueDateTime = new Date(`${task.dueDate}T${task.dueTime || '23:59'}`);
      return dueDateTime < now && task.status !== 'overdue';
    });

    for (const task of tasksToUpdate) {
      try {
        await fetch(`/api/tasks/${task.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'overdue',
            updatedAt: new Date().toISOString(),
          }),
        });
      } catch (err) {
        console.error('Error updating task status:', err);
      }
    }

    if (tasksToUpdate.length > 0) {
      await fetchTasks();
    }
  }, [tasks, fetchTasks]);

  // Check statuses periodically
  useEffect(() => {
    updateTaskStatuses();
    const interval = setInterval(updateTaskStatuses, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [updateTaskStatuses]);

  const createTask = async (taskData: Omit<Task, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('http://localhost:3001/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description,
          dueDate: taskData.dueDate,
          dueTime: taskData.dueTime,
          status: 'pending',
          recurrence: taskData.recurrence,
          customMonthDuration: taskData.customMonthDuration,
          recurrenceEndDate: taskData.recurrenceEndDate,
        }),
      });

      if (!response.ok) throw new Error('Failed to create task');

      const data = await response.json();
      await fetchTasks();
      return data;
    } catch (err: any) {
      console.error('Error creating task:', err);
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updates,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to update task');

      await fetchTasks();
    } catch (err: any) {
      console.error('Error updating task:', err);
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');

      await fetchTasks();
    } catch (err: any) {
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  const markComplete = async (id: string) => {
    await updateTask(id, { status: 'completed', completedAt: new Date().toISOString() });
  };

  const markPending = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const now = new Date();
    const dueDateTime = new Date(`${task.dueDate}T${task.dueTime || '23:59'}`);
    const newStatus: TaskStatus = dueDateTime < now ? 'overdue' : 'pending';
    
    await updateTask(id, { status: newStatus, completedAt: undefined });
  };

  // Get tasks that need reminders (pending/overdue tasks due soon)
  const getUpcomingReminders = useCallback(() => {
    const now = new Date();
    const reminderWindow = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Next 24 hours
    
    return tasks.filter(task => {
      if (task.status === 'completed') return false;
      const dueDateTime = new Date(`${task.dueDate}T${task.dueTime || '23:59'}`);
      return dueDateTime <= reminderWindow;
    });
  }, [tasks]);

  // Get counts
  const overdueCount = tasks.filter(t => t.status === 'overdue').length;
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    markComplete,
    markPending,
    getUpcomingReminders,
    overdueCount,
    pendingCount,
    completedCount,
    refetch: fetchTasks,
  };
};
