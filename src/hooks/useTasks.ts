import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskStatus, RecurrenceType } from '@/types/task';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      const mappedTasks: Task[] = (data || []).map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || undefined,
        dueDate: task.due_date,
        dueTime: task.due_time || undefined,
        status: task.status as TaskStatus,
        recurrence: task.recurrence as RecurrenceType,
        customMonthDuration: task.custom_month_duration || undefined,
        recurrenceEndDate: task.recurrence_end_date || undefined,
        completedAt: task.completed_at || undefined,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
        lastNotified: task.last_notified || undefined,
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
        await supabase
          .from('tasks')
          .update({ status: 'overdue' })
          .eq('id', task.id);
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
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: taskData.title,
          description: taskData.description,
          due_date: taskData.dueDate,
          due_time: taskData.dueTime,
          recurrence: taskData.recurrence,
          custom_month_duration: taskData.customMonthDuration,
          recurrence_end_date: taskData.recurrenceEndDate,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchTasks();
      return data;
    } catch (err: any) {
      console.error('Error creating task:', err);
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    try {
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
      if (updates.dueTime !== undefined) dbUpdates.due_time = updates.dueTime;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.recurrence !== undefined) dbUpdates.recurrence = updates.recurrence;
      if (updates.customMonthDuration !== undefined) dbUpdates.custom_month_duration = updates.customMonthDuration;
      if (updates.recurrenceEndDate !== undefined) dbUpdates.recurrence_end_date = updates.recurrenceEndDate;
      if (updates.completedAt !== undefined) dbUpdates.completed_at = updates.completedAt;
      if (updates.lastNotified !== undefined) dbUpdates.last_notified = updates.lastNotified;

      const { error } = await supabase
        .from('tasks')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      await fetchTasks();
    } catch (err: any) {
      console.error('Error updating task:', err);
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

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
