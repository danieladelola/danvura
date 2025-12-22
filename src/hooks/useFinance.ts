import { useState, useEffect } from 'react';
import { Expense, SavingsGoal, BillingCycle } from '@/types/finance';

const EXPENSES_KEY = 'admin_expenses';
const SAVINGS_KEY = 'admin_savings';

export const useFinance = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [savingsGoal, setSavingsGoal] = useState<SavingsGoal | null>(null);

  useEffect(() => {
    const storedExpenses = localStorage.getItem(EXPENSES_KEY);
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    }

    const storedSavings = localStorage.getItem(SAVINGS_KEY);
    if (storedSavings) {
      setSavingsGoal(JSON.parse(storedSavings));
    }
  }, []);

  const saveExpenses = (newExpenses: Expense[]) => {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(newExpenses));
    setExpenses(newExpenses);
  };

  const saveSavingsGoal = (goal: SavingsGoal | null) => {
    if (goal) {
      localStorage.setItem(SAVINGS_KEY, JSON.stringify(goal));
    } else {
      localStorage.removeItem(SAVINGS_KEY);
    }
    setSavingsGoal(goal);
  };

  const addExpense = (name: string, amount: number, billingCycle: BillingCycle = 'monthly') => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      name,
      amount,
      billingCycle,
      isPaid: false,
      createdAt: new Date().toISOString(),
    };
    saveExpenses([...expenses, newExpense]);
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    const updated = expenses.map(exp => 
      exp.id === id ? { ...exp, ...updates } : exp
    );
    saveExpenses(updated);
  };

  const deleteExpense = (id: string) => {
    saveExpenses(expenses.filter(exp => exp.id !== id));
  };

  const markExpensePaid = (id: string, isPaid: boolean) => {
    updateExpense(id, { isPaid, paidAt: isPaid ? new Date().toISOString() : undefined });
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

  const setSavings = (targetMonth: string, targetAmount: number, savedAmount: number = 0) => {
    const goal: SavingsGoal = {
      id: Date.now().toString(),
      targetMonth,
      targetAmount,
      savedAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveSavingsGoal(goal);
  };

  const updateSavedAmount = (amount: number) => {
    if (savingsGoal) {
      saveSavingsGoal({
        ...savingsGoal,
        savedAmount: amount,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const resetSavings = () => {
    saveSavingsGoal(null);
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
  };
};
