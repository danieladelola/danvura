import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  user: any;
  session: any;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // For file-based system, always consider admin as authenticated
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Stub implementation - always succeed
    return { error: null };
  };

  const signup = async (email: string, password: string) => {
    // Stub implementation - always succeed
    return { error: null };
  };

  const logout = async () => {
    // Stub implementation
  };

  const value = {
    isAuthenticated: true,
    isAdmin: true,
    isLoading,
    user: { email: 'admin@localhost' },
    session: {},
    login,
    signup,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
