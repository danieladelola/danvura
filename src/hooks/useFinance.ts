import { useState, useEffect, useCallback } from 'react';
import { Expense, SavingsGoal, BillingCycle } from '@/types/finance';

export const useFinance = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [savingsGoal, setSavingsGoal] = useState<SavingsGoal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    try {
      const response = await fetch('/api/expenses');
      if (!response.ok) throw new Error('Failed to fetch expenses');
      const data = await response.json();

      const mappedExpenses: Expense[] = data.map((exp: any) => ({
        id: exp.id,
        name: exp.name,
        amount: Number(exp.amount),
        billingCycle: exp.billingCycle as BillingCycle,
        isPaid: exp.isPaid,
        createdAt: exp.createdAt,
        paidAt: exp.paidAt || undefined,
      }));

      setExpenses(mappedExpenses);
    } catch (err: any) {
      console.error('Error fetching expenses:', err);
      setError(err.message);
    }
  }, []);

  const fetchSavingsGoal = useCallback(async () => {
    try {
      const response = await fetch('/api/savings-goals');
      if (!response.ok) throw new Error('Failed to fetch savings goals');
      const data = await response.json();

      if (data.length > 0) {
        const goal = data[0]; // Take the first one
        setSavingsGoal({
          id: goal.id,
          targetMonth: goal.targetMonth,
          targetAmount: Number(goal.targetAmount),
          savedAmount: Number(goal.savedAmount),
          createdAt: goal.createdAt,
          updatedAt: goal.updatedAt,
        });
      } else {
        setSavingsGoal(null);
      }
    } catch (err: any) {
      console.error('Error fetching savings goal:', err);
      setError(err.message);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    await Promise.all([fetchExpenses(), fetchSavingsGoal()]);
    setIsLoading(false);
  }, [fetchExpenses, fetchSavingsGoal]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addExpense = async (name: string, amount: number, billingCycle: BillingCycle = 'monthly') => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          amount,
          billingCycle,
          isPaid: false,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to add expense');

      await fetchExpenses();
    } catch (err: any) {
      console.error('Error adding expense:', err);
      throw err;
    }
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update expense');

      await fetchExpenses();
    } catch (err: any) {
      console.error('Error updating expense:', err);
      throw err;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete expense');

      await fetchExpenses();
    } catch (err: any) {
      console.error('Error deleting expense:', err);
      throw err;
    }
  };

  const markExpensePaid = async (id: string, isPaid: boolean) => {
    await updateExpense(id, { isPaid, paidAt: isPaid ? new Date().toISOString() : undefined });
  };

  const getMonthlyAmount = (expense: Expense): number => {
    switch (expense.billingCycle) {
      case 'daily': return expense.amount * 30;
      case 'weekly': return expense.amount * 4;
      case 'monthly': return expense.amount;
      case 'yearly': return expense.amount / 12;
      default: return expense.amount;
    }
  };

  const totalMonthlyExpenses = expenses.reduce((sum, exp) => sum + getMonthlyAmount(exp), 0);
  const paidExpenses = expenses.filter(exp => exp.isPaid);
  const paidAmount = paidExpenses.reduce((sum, exp) => sum + getMonthlyAmount(exp), 0);
  const remainingAmount = totalMonthlyExpenses - paidAmount;

  const setSavings = async (targetMonth: string, targetAmount: number, savedAmount: number = 0) => {
    try {
      // Delete existing goals first
      const existingGoals = await fetch('/api/savings-goals').then(r => r.json());
      for (const goal of existingGoals) {
        await fetch(`/api/savings-goals/${goal.id}`, { method: 'DELETE' });
      }

      const response = await fetch('/api/savings-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetMonth,
          targetAmount,
          savedAmount,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to set savings goal');

      await fetchSavingsGoal();
    } catch (err: any) {
      console.error('Error setting savings goal:', err);
      throw err;
    }
  };

  const updateSavedAmount = async (amount: number) => {
    if (!savingsGoal) return;

    try {
      const response = await fetch(`/api/savings-goals/${savingsGoal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          savedAmount: amount,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to update saved amount');

      await fetchSavingsGoal();
    } catch (err: any) {
      console.error('Error updating saved amount:', err);
      throw err;
    }
  };

  const resetSavings = async () => {
    try {
      if (savingsGoal) {
        const response = await fetch(`/api/savings-goals/${savingsGoal.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to reset savings');
      }

      setSavingsGoal(null);
    } catch (err: any) {
      console.error('Error resetting savings:', err);
      throw err;
    }
  };

  const getDailySavingsNeeded = (): number => {
    if (!savingsGoal) return 0;
    const remaining = savingsGoal.targetAmount - savingsGoal.savedAmount;
    if (remaining <= 0) return 0;
    
    const targetDate = new Date(savingsGoal.targetMonth + '-01');
    const today = new Date();
    const daysLeft = Math.max(1, Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    
    return remaining / daysLeft;
  };

  const getSavingsProgress = (): number => {
    if (!savingsGoal || savingsGoal.targetAmount === 0) return 0;
    return Math.min(100, (savingsGoal.savedAmount / savingsGoal.targetAmount) * 100);
  };

  return {
    expenses,
    savingsGoal,
    isLoading,
    error,
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
    refetch: fetchAll,
  };
};
