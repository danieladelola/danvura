import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Expense, SavingsGoal, BillingCycle } from '@/types/finance';

export const useFinance = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [savingsGoal, setSavingsGoal] = useState<SavingsGoal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const mappedExpenses: Expense[] = (data || []).map(exp => ({
        id: exp.id,
        name: exp.name,
        amount: Number(exp.amount),
        billingCycle: exp.billing_cycle as BillingCycle,
        isPaid: exp.is_paid,
        createdAt: exp.created_at,
        paidAt: exp.paid_at || undefined,
      }));

      setExpenses(mappedExpenses);
    } catch (err: any) {
      console.error('Error fetching expenses:', err);
      setError(err.message);
    }
  }, []);

  const fetchSavingsGoal = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('savings_goals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data) {
        setSavingsGoal({
          id: data.id,
          targetMonth: data.target_month,
          targetAmount: Number(data.target_amount),
          savedAmount: Number(data.saved_amount),
          createdAt: data.created_at,
          updatedAt: data.updated_at,
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
      const { error } = await supabase
        .from('expenses')
        .insert({
          name,
          amount,
          billing_cycle: billingCycle,
        });

      if (error) throw error;

      await fetchExpenses();
    } catch (err: any) {
      console.error('Error adding expense:', err);
      throw err;
    }
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.amount !== undefined) dbUpdates.amount = updates.amount;
      if (updates.billingCycle !== undefined) dbUpdates.billing_cycle = updates.billingCycle;
      if (updates.isPaid !== undefined) dbUpdates.is_paid = updates.isPaid;
      if (updates.paidAt !== undefined) dbUpdates.paid_at = updates.paidAt;

      const { error } = await supabase
        .from('expenses')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      await fetchExpenses();
    } catch (err: any) {
      console.error('Error updating expense:', err);
      throw err;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

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
      await supabase.from('savings_goals').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      const { error } = await supabase
        .from('savings_goals')
        .insert({
          target_month: targetMonth,
          target_amount: targetAmount,
          saved_amount: savedAmount,
        });

      if (error) throw error;

      await fetchSavingsGoal();
    } catch (err: any) {
      console.error('Error setting savings goal:', err);
      throw err;
    }
  };

  const updateSavedAmount = async (amount: number) => {
    if (!savingsGoal) return;

    try {
      const { error } = await supabase
        .from('savings_goals')
        .update({ saved_amount: amount })
        .eq('id', savingsGoal.id);

      if (error) throw error;

      await fetchSavingsGoal();
    } catch (err: any) {
      console.error('Error updating saved amount:', err);
      throw err;
    }
  };

  const resetSavings = async () => {
    try {
      if (savingsGoal) {
        const { error } = await supabase
          .from('savings_goals')
          .delete()
          .eq('id', savingsGoal.id);

        if (error) throw error;
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
