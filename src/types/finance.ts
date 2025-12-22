export type BillingCycle = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Expense {
  id: string;
  name: string;
  amount: number;
  billingCycle: BillingCycle;
  isPaid: boolean;
  createdAt: string;
  paidAt?: string;
}

export interface SavingsGoal {
  id: string;
  targetMonth: string;
  targetAmount: number;
  savedAmount: number;
  createdAt: string;
  updatedAt: string;
}
