import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTasks } from '@/hooks/useTasks';
import { Task, RecurrenceType } from '@/types/task';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Bell,
  Calendar,
  RotateCcw,
  Circle
} from 'lucide-react';
import { format } from 'date-fns';

const AdminTasks = () => {
  const { 
    tasks, 
    createTask, 
    updateTask, 
    deleteTask, 
    markComplete, 
    markPending,
    getUpcomingReminders,
    overdueCount,
    pendingCount,
    completedCount 
  } = useTasks();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showReminders, setShowReminders] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
  const [customMonthDuration, setCustomMonthDuration] = useState(2);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');

  // Browser notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Check for reminders and show notifications
  useEffect(() => {
    const checkReminders = () => {
      const reminders = getUpcomingReminders();
      reminders.forEach(task => {
        const lastNotified = task.lastNotified ? new Date(task.lastNotified) : null;
        const now = new Date();
        
        // Only notify if not notified in the last hour
        if (!lastNotified || (now.getTime() - lastNotified.getTime()) > 3600000) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Task Reminder: ${task.title}`, {
              body: task.description || `Due: ${format(new Date(task.dueDate), 'MMM d, yyyy')}`,
              icon: '/favicon.ico'
            });
          }
          updateTask(task.id, { lastNotified: now.toISOString() });
        }
      });
    };

    checkReminders();
    const interval = setInterval(checkReminders, 300000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, [getUpcomingReminders, updateTask]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setDueTime('');
    setRecurrence('none');
    setCustomMonthDuration(2);
    setRecurrenceEndDate('');
    setEditingTask(null);
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setDueDate(task.dueDate);
    setDueTime(task.dueTime || '');
    setRecurrence(task.recurrence);
    setCustomMonthDuration(task.customMonthDuration || 2);
    setRecurrenceEndDate(task.recurrenceEndDate || '');
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !dueDate) {
      toast({
        title: "Error",
        description: "Title and due date are required",
        variant: "destructive"
      });
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate,
      dueTime: dueTime || undefined,
      recurrence,
      customMonthDuration: recurrence === 'custom' ? customMonthDuration : undefined,
      recurrenceEndDate: recurrence !== 'none' ? recurrenceEndDate || undefined : undefined,
    };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
      toast({ title: "Task updated successfully" });
    } else {
      createTask(taskData);
      toast({ title: "Task created successfully" });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    toast({ title: "Task deleted" });
  };

  const handleToggleComplete = (task: Task) => {
    if (task.status === 'completed') {
      markPending(task.id);
      toast({ title: "Task marked as pending" });
    } else {
      markComplete(task.id);
      toast({ title: "Task completed!" });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Completed</Badge>;
      case 'overdue':
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Overdue</Badge>;
      default:
        return <Badge className="bg-primary/20 text-primary border-primary/30">Pending</Badge>;
    }
  };

  const getRecurrenceLabel = (task: Task) => {
    switch (task.recurrence) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      case 'custom':
        return `Every ${task.customMonthDuration} months`;
      default:
        return 'One-time';
    }
  };

  const upcomingReminders = getUpcomingReminders();

  const TaskCard = ({ task }: { task: Task }) => (
    <Card className={`transition-all ${task.status === 'completed' ? 'opacity-60' : ''} ${task.status === 'overdue' ? 'border-destructive/50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <button
              onClick={() => handleToggleComplete(task)}
              className="mt-1 transition-colors"
            >
              {task.status === 'completed' ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
              )}
            </button>
            <div className="flex-1">
              <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(task.dueDate), 'MMM d, yyyy')}
                  {task.dueTime && ` at ${task.dueTime}`}
                </span>
                {task.recurrence !== 'none' && (
                  <span className="flex items-center gap-1">
                    <RotateCcw className="h-3 w-3" />
                    {getRecurrenceLabel(task)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(task.status)}
            <Button variant="ghost" size="icon" onClick={() => openEditDialog(task)}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Task</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{task.title}"? This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(task.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Task Manager</h1>
            <p className="text-muted-foreground">Manage your to-dos and reminders</p>
          </div>
          <div className="flex gap-2">
            {upcomingReminders.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowReminders(!showReminders)}
                className="relative"
              >
                <Bell className="h-4 w-4 mr-2" />
                Reminders
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  {upcomingReminders.length}
                </span>
              </Button>
            )}
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Task title"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Optional description"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date *</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dueTime">Time</Label>
                      <Input
                        id="dueTime"
                        type="time"
                        value={dueTime}
                        onChange={(e) => setDueTime(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Recurrence</Label>
                    <Select value={recurrence} onValueChange={(v: RecurrenceType) => setRecurrence(v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">One-time (No recurrence)</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="custom">Custom (Months)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {recurrence === 'custom' && (
                    <div className="space-y-2">
                      <Label htmlFor="customDuration">Repeat every X months</Label>
                      <Input
                        id="customDuration"
                        type="number"
                        min={1}
                        max={12}
                        value={customMonthDuration}
                        onChange={(e) => setCustomMonthDuration(parseInt(e.target.value) || 2)}
                      />
                    </div>
                  )}
                  
                  {recurrence !== 'none' && (
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Recurrence End Date (optional)</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={recurrenceEndDate}
                        onChange={(e) => setRecurrenceEndDate(e.target.value)}
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => {
                      resetForm();
                      setIsDialogOpen(false);
                    }}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingTask ? 'Update Task' : 'Create Task'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Reminder Alert */}
        {showReminders && upcomingReminders.length > 0 && (
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Upcoming Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcomingReminders.map(task => (
                <div key={task.id} className="flex items-center justify-between p-2 bg-background rounded-lg">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                      {task.dueTime && ` at ${task.dueTime}`}
                    </p>
                  </div>
                  <Button size="sm" onClick={() => handleToggleComplete(task)}>
                    Mark Done
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending Tasks</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-destructive/20 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{overdueCount}</p>
                <p className="text-sm text-muted-foreground">Overdue</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCount}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task List */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
            <TabsTrigger value="overdue">Overdue ({overdueCount})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedCount})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-3 mt-4">
            {tasks.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tasks yet. Create your first task!</p>
                </CardContent>
              </Card>
            ) : (
              tasks
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .map(task => <TaskCard key={task.id} task={task} />)
            )}
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-3 mt-4">
            {tasks.filter(t => t.status === 'pending').length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending tasks!</p>
                </CardContent>
              </Card>
            ) : (
              tasks
                .filter(t => t.status === 'pending')
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .map(task => <TaskCard key={task.id} task={task} />)
            )}
          </TabsContent>
          
          <TabsContent value="overdue" className="space-y-3 mt-4">
            {tasks.filter(t => t.status === 'overdue').length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No overdue tasks!</p>
                </CardContent>
              </Card>
            ) : (
              tasks
                .filter(t => t.status === 'overdue')
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .map(task => <TaskCard key={task.id} task={task} />)
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-3 mt-4">
            {tasks.filter(t => t.status === 'completed').length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No completed tasks yet.</p>
                </CardContent>
              </Card>
            ) : (
              tasks
                .filter(t => t.status === 'completed')
                .sort((a, b) => new Date(b.completedAt || b.updatedAt).getTime() - new Date(a.completedAt || a.updatedAt).getTime())
                .map(task => <TaskCard key={task.id} task={task} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminTasks;
