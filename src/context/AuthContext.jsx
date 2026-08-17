import React, { createContext, useContext, useEffect } from 'react';
import { useUser, useAuth as useClerkAuth, useClerk } from '@clerk/clerk-react';
import { setTokenGetter, setActiveUserEmail } from '../api/client';
import { employeeApi } from '../api/employeeApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { getToken, signOut } = useClerkAuth();
  const clerk = useClerk();
  const [currentEmployee, setCurrentEmployee] = React.useState(null);

  const userEmail = clerkUser?.primaryEmailAddress?.emailAddress || '';

  // Register token getter and active user email header
  useEffect(() => {
    if (isLoaded && isSignedIn && getToken) {
      setTokenGetter(() => getToken());
      if (userEmail) {
        setActiveUserEmail(userEmail);
        employeeApi
          .syncClerk(userEmail)
          .then((emp) => {
            setCurrentEmployee(emp);
          })
          .catch((err) => {
            console.warn('Auto clerk employee sync note:', err);
          });
      }
    } else {
      setTokenGetter(null);
      setActiveUserEmail(null);
      setCurrentEmployee(null);
    }
  }, [isLoaded, isSignedIn, getToken, userEmail]);

  const backendRole = currentEmployee?.role?.role_name?.toUpperCase();
  const fallbackRole = (clerkUser?.publicMetadata?.role || 'ADMIN').toUpperCase();
  const userRole = backendRole || fallbackRole;

  const isAdmin = userRole === 'ADMIN';
  const canManageEmployees = userRole === 'ADMIN' || userRole === 'MANAGER';
  const canManageProjects = userRole === 'ADMIN' || userRole === 'MANAGER';

  const user = isSignedIn && clerkUser ? {
    id: clerkUser.id,
    name: clerkUser.fullName || clerkUser.firstName || userEmail.split('@')[0] || 'User',
    email: userEmail,
    role: userRole,
    imageUrl: clerkUser.imageUrl,
  } : null;

  const logout = async () => {
    if (signOut) {
      await signOut();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoaded,
        isAuthenticated: Boolean(isSignedIn),
        user,
        currentEmployee,
        userRole,
        isAdmin,
        canManageEmployees,
        canManageProjects,
        logout,
        clerk,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
