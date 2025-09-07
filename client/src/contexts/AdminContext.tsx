import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

interface AdminStats {
  users: {
    total: number;
    students: number;
    teachers: number;
    admins: number;
    active: number;
    recent: number;
    activeLast30Days: number;
  };
  assignments: {
    total: number;
    active: number;
    overdue: number;
    recent: number;
  };
  submissions: {
    total: number;
    recent: number;
  };
  notifications: {
    total: number;
  };
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  assignmentsCount?: number;
  submissionsCount?: number;
}

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  isActive: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
}

interface Submission {
  _id: string;
  assignment: {
    _id: string;
    title: string;
    dueDate: string;
  };
  submittedBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  submittedAt: string;
  grade?: number;
}

interface AdminContextType {
  stats: AdminStats | null;
  users: User[];
  assignments: Assignment[];
  submissions: Submission[];
  loading: boolean;
  error: string | null;
  
  // Stats functions
  fetchStats: () => Promise<void>;
  
  // User management functions
  fetchUsers: (params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
    isActive?: boolean;
  }) => Promise<void>;
  createUser: (userData: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'teacher' | 'admin';
  }) => Promise<void>;
  updateUserStatus: (userId: string, isActive: boolean) => Promise<void>;
  updateUserRole: (userId: string, role: 'student' | 'teacher' | 'admin') => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  
  // Content management functions
  fetchAssignments: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => Promise<void>;
  fetchSubmissions: (params?: {
    page?: number;
    limit?: number;
    status?: string;
<<<<<<< HEAD
  }) => Promise<{ pagination?: { current: number; pages: number; total: number; limit: number } } | void>;
=======
  }) => Promise<void>;
>>>>>>> a85ce94f8c53a7281e97162b415297d808b7c473
  
  // Utility functions
  clearError: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const handleError = (error: any) => {
    console.error('Admin API error:', error);
    const errorMessage = error.response?.data?.message || 'An error occurred';
    setError(errorMessage);
  };

  // Stats functions
  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
        headers: getAuthHeaders()
      });
      setStats(response.data.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // User management functions
  const fetchUsers = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/users?${queryParams}`,
        { headers: getAuthHeaders() }
      );
      setUsers(response.data.data.users);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'teacher' | 'admin';
  }) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/users`, userData, {
        headers: getAuthHeaders()
      });
      // Refresh users list
      await fetchUsers();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/status`,
        { isActive },
        { headers: getAuthHeaders() }
      );
      // Refresh users list
      await fetchUsers();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: 'student' | 'teacher' | 'admin') => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/role`,
        { role },
        { headers: getAuthHeaders() }
      );
      // Refresh users list
      await fetchUsers();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`, {
        headers: getAuthHeaders()
      });
      // Refresh users list
      await fetchUsers();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Content management functions
  const fetchAssignments = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/assignments?${queryParams}`,
        { headers: getAuthHeaders() }
      );
      setAssignments(response.data.data.assignments);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/submissions?${queryParams}`,
        { headers: getAuthHeaders() }
      );
      setSubmissions(response.data.data.submissions);
<<<<<<< HEAD
      return { pagination: response.data.data.pagination };
=======
>>>>>>> a85ce94f8c53a7281e97162b415297d808b7c473
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Utility functions
  const clearError = () => setError(null);

  // Auto-fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        stats,
        users,
        assignments,
        submissions,
        loading,
        error,
        fetchStats,
        fetchUsers,
        createUser,
        updateUserStatus,
        updateUserRole,
        deleteUser,
        fetchAssignments,
        fetchSubmissions,
        clearError
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
