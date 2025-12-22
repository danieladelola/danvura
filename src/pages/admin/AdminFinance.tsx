import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFinance } from '@/hooks/useFinance';
import { BillingCycle } from '@/types/finance';
import { Plus, Trash2, Edit2, DollarSign, PiggyBank, Target, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const AdminFinance = () => {
  const {
    expenses,
    savingsGoal,
    addExpense,
    updateExpense,
    deleteExpense,
    markExpensePaid,
    getMonthlyAmount,
    totalMonthlyExpenses,
    paidAmount,
    remainingAmount,
    setSavings,
    updateSavedAmount,
    resetSavings,
    getDailySavingsNeeded,
    getSavingsProgress,
  } = useFinance();

  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [editingExpense, setEditingExpense] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCycle, setEditCycle] = useState<BillingCycle>('monthly');

  const [targetMonth, setTargetMonth] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [addSavingsAmount, setAddSavingsAmount] = useState('');

  const handleAddExpense = () => {
    if (!expenseName.trim() || !expenseAmount) return;
    addExpense(expenseName.trim(), parseFloat(expenseAmount), billingCycle);
    setExpenseName('');
    setExpenseAmount('');
    setBillingCycle('monthly');
  };

  const handleEditExpense = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    if (expense) {
      setEditingExpense(id);
      setEditName(expense.name);
      setEditAmount(expense.amount.toString());
      setEditCycle(expense.billingCycle);
    }
  };

  const handleSaveEdit = () => {
    if (editingExpense && editName.trim() && editAmount) {
      updateExpense(editingExpense, {
        name: editName.trim(),
        amount: parseFloat(editAmount),
        billingCycle: editCycle,
      });
      setEditingExpense(null);
    }
  };

  const handleSetSavingsGoal = () => {
    if (!targetMonth || !targetAmount) return;
    setSavings(targetMonth, parseFloat(targetAmount), savingsGoal?.savedAmount || 0);
  };

  const handleAddToSavings = () => {
    if (!addSavingsAmount || !savingsGoal) return;
    updateSavedAmount(savingsGoal.savedAmount + parseFloat(addSavingsAmount));
    setAddSavingsAmount('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  const formatMonth = (monthStr: string) => {
    const date = new Date(monthStr + '-01');
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Finance</h1>
          <p className="text-muted-foreground mt-1">Manage expenses and track savings</p>
        </div>

        <Tabs defaultValue="expenses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <DollarSign size={16} />
              Fixed Expenses
            </TabsTrigger>
            <TabsTrigger value="savings" className="flex items-center gap-2">
              <PiggyBank size={16} />
              Savings Tracker
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Monthly</p>
                      <p className="text-2xl font-bold text-foreground">{formatCurrency(totalMonthlyExpenses)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Paid</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 font-bold">{expenses.filter(e => e.isPaid).length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Remaining</p>
                      <p className="text-2xl font-bold text-orange-600">{formatCurrency(remainingAmount)}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-orange-600 font-bold">{expenses.filter(e => !e.isPaid).length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Add Expense Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add New Expense</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <Label htmlFor="expenseName">Expense Name</Label>
                    <Input
                      id="expenseName"
                      placeholder="e.g., Netflix, Electricity"
                      value={expenseName}
                      onChange={(e) => setExpenseName(e.target.value)}
                    />
                  </div>
                  <div className="w-32">
                    <Label htmlFor="expenseAmount">Amount</Label>
                    <Input
                      id="expenseAmount"
                      type="number"
                      placeholder="0.00"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                    />
                  </div>
                  <div className="w-40">
                    <Label>Billing Cycle</Label>
                    <Select value={billingCycle} onValueChange={(v) => setBillingCycle(v as BillingCycle)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddExpense}>
                      <Plus size={16} className="mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expenses List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">All Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                {expenses.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No expenses added yet</p>
                ) : (
                  <div className="space-y-3">
                    {expenses.map((expense) => (
                      <div
                        key={expense.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          expense.isPaid ? 'bg-green-50 border-green-200' : 'bg-card border-border'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <Checkbox
                            checked={expense.isPaid}
                            onCheckedChange={(checked) => markExpensePaid(expense.id, checked as boolean)}
                          />
                          <div>
                            <p className={`font-medium ${expense.isPaid ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {expense.name}
                            </p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {expense.billingCycle} • {formatCurrency(getMonthlyAmount(expense))}/mo
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{formatCurrency(expense.amount)}</span>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => handleEditExpense(expense.id)}>
                                <Edit2 size={16} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Expense</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 pt-4">
                                <div>
                                  <Label>Name</Label>
                                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                                </div>
                                <div>
                                  <Label>Amount</Label>
                                  <Input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} />
                                </div>
                                <div>
                                  <Label>Billing Cycle</Label>
                                  <Select value={editCycle} onValueChange={(v) => setEditCycle(v as BillingCycle)}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="daily">Daily</SelectItem>
                                      <SelectItem value="weekly">Weekly</SelectItem>
                                      <SelectItem value="monthly">Monthly</SelectItem>
                                      <SelectItem value="yearly">Yearly</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button onClick={handleSaveEdit} className="w-full">Save Changes</Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="icon" onClick={() => deleteExpense(expense.id)}>
                            <Trash2 size={16} className="text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="savings" className="space-y-6">
            {/* Savings Goal Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target size={20} />
                  {savingsGoal ? 'Update Savings Goal' : 'Set Savings Goal'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <Label htmlFor="targetMonth">Target Month</Label>
                    <Input
                      id="targetMonth"
                      type="month"
                      value={targetMonth || savingsGoal?.targetMonth || ''}
                      onChange={(e) => setTargetMonth(e.target.value)}
                    />
                  </div>
                  <div className="w-48">
                    <Label htmlFor="targetAmount">Target Amount</Label>
                    <Input
                      id="targetAmount"
                      type="number"
                      placeholder="0.00"
                      value={targetAmount || savingsGoal?.targetAmount || ''}
                      onChange={(e) => setTargetAmount(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button onClick={handleSetSavingsGoal}>
                      {savingsGoal ? 'Update Goal' : 'Set Goal'}
                    </Button>
                    {savingsGoal && (
                      <Button variant="outline" onClick={resetSavings}>
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {savingsGoal && (
              <>
                {/* Progress Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <PiggyBank size={20} />
                      Savings Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{getSavingsProgress().toFixed(1)}%</span>
                      </div>
                      <Progress value={getSavingsProgress()} className="h-3" />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Saved: <span className="font-medium text-green-600">{formatCurrency(savingsGoal.savedAmount)}</span>
                        </span>
                        <span className="text-muted-foreground">
                          Goal: <span className="font-medium">{formatCurrency(savingsGoal.targetAmount)}</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground">Amount Left</p>
                        <p className="text-xl font-bold text-foreground">
                          {formatCurrency(Math.max(0, savingsGoal.targetAmount - savingsGoal.savedAmount))}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground">Daily Savings Needed</p>
                        <p className="text-xl font-bold text-primary">
                          {formatCurrency(getDailySavingsNeeded())}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar size={14} />
                          Target Month
                        </p>
                        <p className="text-xl font-bold text-foreground">
                          {formatMonth(savingsGoal.targetMonth)}
                        </p>
                      </div>
                    </div>

                    {/* Add to Savings */}
                    <div className="flex gap-4 pt-4 border-t">
                      <div className="flex-1">
                        <Label htmlFor="addSavings">Add to Savings</Label>
                        <Input
                          id="addSavings"
                          type="number"
                          placeholder="Enter amount"
                          value={addSavingsAmount}
                          onChange={(e) => setAddSavingsAmount(e.target.value)}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button onClick={handleAddToSavings}>
                          <Plus size={16} className="mr-2" />
                          Add Savings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {!savingsGoal && (
              <Card>
                <CardContent className="py-12 text-center">
                  <PiggyBank className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Set a savings goal to start tracking your progress</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminFinance;
