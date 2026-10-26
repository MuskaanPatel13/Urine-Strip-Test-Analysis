import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user] = useState({
    name: 'Dr. Nikhil (Biomedical Staff)',
    email: 'staff@hospital.edu',
    staffRole: 'Lab Technician',
    department: 'Biomedical & Point-of-Care Testing (KJS-HC-03)',
    hospitalId: 'KJS-POC-LAB-01'
  });

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: true, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
