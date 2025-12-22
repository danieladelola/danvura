export interface Subscriber {
  id: string;
  email: string;
  firstName?: string;
  source: 'email-list' | 'about';
  status: 'active' | 'unsubscribed';
  signupDate: string;
  lastActivity?: string;
}