import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus } from '@/types/task';

const TASKS_KEY = 'admin_tasks';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(TASKS_KEY);
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  // Save tasks to localStorage
  const saveTasks = useCallback((newTasks: Task[]) => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(newTasks));
    setTasks(newTasks);
  }, []);

  // Update task statuses based on due dates
  const updateTaskStatuses = useCallback(() => {
    const now = new Date();
    const updatedTasks = tasks.map(task => {
      if (task.status === 'completed') return task;
      
      const dueDateTime = new Date(`${task.dueDate}T${task.dueTime || '23:59'}`);
      if (dueDateTime < now && task.status !== 'overdue') {
        return { ...task, status: 'overdue' as TaskStatus };
      }
      return task;
    });
    
    if (JSON.stringify(updatedTasks) !== JSON.stringify(tasks)) {
      saveTasks(updatedTasks);
    }
  }, [tasks, saveTasks]);

  // Check statuses periodically
  useEffect(() => {
    updateTaskStatuses();
    const interval = setInterval(updateTaskStatuses, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [updateTaskStatuses]);

  const createTask = useCallback((taskData: Omit<Task, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveTasks([...tasks, newTask]);
    return newTask;
  }, [tasks, saveTasks]);

  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    const updatedTasks = tasks.map(task =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    );
    saveTasks(updatedTasks);
  }, [tasks, saveTasks]);

  const deleteTask = useCallback((id: string) => {
    saveTasks(tasks.filter(task => task.id !== id));
  }, [tasks, saveTasks]);

  const markComplete = useCallback((id: string) => {
    updateTask(id, { status: 'completed', completedAt: new Date().toISOString() });
  }, [updateTask]);

  const markPending = useCallback((id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const now = new Date();
    const dueDateTime = new Date(`${task.dueDate}T${task.dueTime || '23:59'}`);
    const newStatus: TaskStatus = dueDateTime < now ? 'overdue' : 'pending';
    
    updateTask(id, { status: newStatus, completedAt: undefined });
  }, [tasks, updateTask]);

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

  // Get overdue tasks count
  const overdueCount = tasks.filter(t => t.status === 'overdue').length;
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    markComplete,
    markPending,
    getUpcomingReminders,
    overdueCount,
    pendingCount,
    completedCount,
  };
};
