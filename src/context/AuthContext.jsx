import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const DEMO_USERS = {
  admin: {
    id: 'user_admin',
    name: 'Alex Morgan',
    email: 'alex.m@memoradesk.ai',
    role: 'Lead Support Engineer',
    company: 'MemoraDesk Internal',
    plan: 'Platform Admin',
    cluster: 'eu-central-1 (Frankfurt)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    memoriesAccess: 'Full Organization'
  },
  sarah: {
    id: 'cust_001',
    name: 'Sarah Chen',
    email: 'sarah.chen@fintechlabs.io',
    role: 'Lead Cloud Architect',
    company: 'FinTech Labs Global',
    plan: 'Enterprise',
    cluster: 'us-east-1 (N. Virginia)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    memoriesAccess: 'Customer Partition'
  },
  elena: {
    id: 'cust_003',
    name: 'Elena Rostova',
    email: 'elena@novabank.eu',
    role: 'VP of Platform Engineering',
    company: 'NovaBank Digital',
    plan: 'Enterprise VIP',
    cluster: 'eu-central-1 (Frankfurt - BaFin GDPR)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    memoriesAccess: 'Sovereign Partition'
  },
  judge: {
    id: 'user_judge',
    name: 'Hackathon Evaluator',
    email: 'judge@hackwithhyderabad.in',
    role: 'Hack with Hyderabad 3.0 Judge',
    company: 'Hack with Hyderabad',
    plan: 'VIP Evaluator Pass',
    cluster: 'Global Memory Sandbox',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    memoriesAccess: 'Full Access (Hindsight Inspector)'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('memoradesk_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_USERS.admin;
      }
    }
    // Default logged in as admin/lead for seamless hackathon testing, but user can log out
    return DEMO_USERS.admin;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('memoradesk_auth') !== 'false';
  });

  useEffect(() => {
    if (user && isAuthenticated) {
      localStorage.setItem('memoradesk_user', JSON.stringify(user));
      localStorage.setItem('memoradesk_auth', 'true');
    } else {
      localStorage.removeItem('memoradesk_user');
      localStorage.setItem('memoradesk_auth', 'false');
    }
  }, [user, isAuthenticated]);

  const login = (email, password, remember = true) => {
    // Check if matches one of demo users or create dynamic user
    const found = Object.values(DEMO_USERS).find(u => u.email.toLowerCase() === email.toLowerCase());
    const newUser = found || {
      id: 'usr_' + Math.random().toString(36).substring(2, 7),
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      role: 'Support Agent',
      company: 'Enterprise Customer',
      plan: 'Pro',
      cluster: 'us-east-1',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      memoriesAccess: 'Standard'
    };

    setUser(newUser);
    setIsAuthenticated(true);
    return newUser;
  };

  const loginAs = (personaKey) => {
    const persona = DEMO_USERS[personaKey] || DEMO_USERS.admin;
    setUser(persona);
    setIsAuthenticated(true);
    return persona;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        loginAs,
        logout,
        demoUsers: DEMO_USERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
