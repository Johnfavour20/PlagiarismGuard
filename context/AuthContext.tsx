import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { User, AuthContextType } from '../types.ts';

// --- Mock Database (localStorage wrappers) ---
const MOCK_API_DELAY = 500;

const getUsers = (): User[] => {
  try {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  } catch (e) {
    return [];
  }
};

const setUsers = (users: User[]) => {
  localStorage.setItem('users', JSON.stringify(users));
};

const getLoggedInUser = (): User | null => {
  try {
    const user = localStorage.getItem('loggedInUser');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};

const setLoggedInUser = (user: User | null) => {
  if (user) {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('loggedInUser');
  }
};

// --- Auth Context ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize mock data if it doesn't exist
    if (!localStorage.getItem('users')) {
      const mockUsers: User[] = [
        { _id: 'user-admin-01', name: 'Admin User', email: 'admin@uniport.edu.ng', password: 'admin123', role: 'admin', university: 'University of Port Harcourt' },
        { _id: 'user-lecturer-01', name: 'Lecturer Tega', email: 'lecturer@uniport.edu.ng', password: 'lecturer123', role: 'lecturer', university: 'University of Port Harcourt' },
        { _id: 'user-student-01', name: 'Student Ada', email: 'student@uniport.edu.ng', password: 'student123', role: 'student', university: 'University of Port Harcourt' },
      ];
      setUsers(mockUsers);
    }
     if (!localStorage.getItem('submissions')) {
        localStorage.setItem('submissions', JSON.stringify([]));
     }

    // Load user from "session" (localStorage)
    const loggedInUser = getLoggedInUser();
    if (loggedInUser) {
      setUser(loggedInUser);
    }
    setLoading(false);
  }, []);

  const register = async (userData: any): Promise<{ success: boolean, user?: User, error?: string }> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const users = getUsers();
        const existingUser = users.find(u => u.email === userData.email);

        if (existingUser) {
          toast.error('An account with this email already exists.');
          return resolve({ success: false, error: 'User already exists' });
        }

        const newUser: User = {
          ...userData,
          _id: `user-${Date.now()}`,
        };
        
        users.push(newUser);
        setUsers(users);
        setLoggedInUser(newUser);
        setUser(newUser);
        
        toast.success('Registration successful!');
        resolve({ success: true, user: newUser });
      }, MOCK_API_DELAY);
    });
  };

  const login = async (email: string, password: string): Promise<{ success: boolean, user?: User, error?: string }> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const users = getUsers();
        const foundUser = users.find(u => u.email === email && u.password === password);

        if (foundUser) {
          const userToSave = { ...foundUser };
          delete userToSave.password; // Don't store password in session
          
          setLoggedInUser(userToSave);
          setUser(userToSave);
          toast.success(`Welcome back, ${foundUser.name}!`);
          resolve({ success: true, user: userToSave });
        } else {
          toast.error('Invalid email or password.');
          resolve({ success: false, error: 'Invalid credentials' });
        }
      }, MOCK_API_DELAY);
    });
  };

  const logout = () => {
    setLoggedInUser(null);
    setUser(null);
    toast.info('Logged out successfully');
  };
  
  const updateProfile = async (updates: { name: string; university: string }): Promise<{ success: boolean; user?: User; error?: string }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (!user) return resolve({ success: false, error: 'Not authenticated' });

            const users = getUsers();
            const userIndex = users.findIndex(u => u._id === user._id);

            if (userIndex === -1) {
                toast.error('User not found.');
                return resolve({ success: false, error: 'User not found' });
            }
            
            // Update the full user list
            const userWithPassword = users[userIndex].password;
            const updatedUserInList = { ...users[userIndex], ...updates, password: userWithPassword };
            users[userIndex] = updatedUserInList;
            setUsers(users);

            // Update the session user
            const updatedSessionUser = { ...getLoggedInUser(), ...updates };
            setLoggedInUser(updatedSessionUser as User);
            setUser(updatedSessionUser as User);

            toast.success('Profile updated successfully!');
            resolve({ success: true, user: updatedSessionUser as User });
        }, MOCK_API_DELAY);
    });
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (!user) return resolve({ success: false, error: 'Not authenticated' });

            const users = getUsers();
            const userIndex = users.findIndex(u => u._id === user._id);

            if (userIndex === -1) {
                toast.error('User not found.');
                return resolve({ success: false, error: 'User not found' });
            }
            
            const userWithPassword = users[userIndex];

            if (userWithPassword.password !== currentPassword) {
                toast.error('Incorrect current password.');
                return resolve({ success: false, error: 'Incorrect current password' });
            }

            users[userIndex] = { ...userWithPassword, password: newPassword };
            setUsers(users);
            
            toast.success('Password changed successfully!');
            resolve({ success: true });
        }, MOCK_API_DELAY);
    });
  };

  const value: AuthContextType = {
    user,
    token: user ? 'mock-token' : null, // Simulate token presence
    loading,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLecturer: user?.role === 'lecturer',
    isStudent: user?.role === 'student'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};