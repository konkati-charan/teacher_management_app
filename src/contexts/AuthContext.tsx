import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface Teacher {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  contactNumber: string;
}

interface AuthContextType {
  teacher: Teacher | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (teacherData: Omit<Teacher, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  attendanceMarked: boolean;
  markAttendance: () => void;
  radiusVerified: boolean;
  setRadiusVerified: (verified: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [radiusVerified, setRadiusVerified] = useState(false);

  useEffect(() => {
    const storedTeacher = localStorage.getItem('teacher');
    const storedAttendance = localStorage.getItem('attendanceMarked');

    if (storedTeacher) {
      setTeacher(JSON.parse(storedTeacher));
    }
    if (storedAttendance === 'true') {
      setAttendanceMarked(true);
    }
  }, []);

  const register = async (teacherData: Omit<Teacher, 'id'> & { password: string }): Promise<boolean> => {
    try {
      const res = await axios.post('http://localhost:5000/api/register', teacherData);
      return res.status === 201;
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post('http://localhost:5000/api/login', { email, password });
      if (res.status === 200 && res.data.teacher) {
        setTeacher(res.data.teacher);
        localStorage.setItem('teacher', JSON.stringify(res.data.teacher));
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      return false;
    }
  };

  const logout = () => {
    setTeacher(null);
    setAttendanceMarked(false);
    setRadiusVerified(false);
    localStorage.removeItem('teacher');
    localStorage.removeItem('attendanceMarked');
  };

  const markAttendance = () => {
    setAttendanceMarked(true);
    localStorage.setItem('attendanceMarked', 'true');
  };

  const value: AuthContextType = {
    teacher,
    login,
    register,
    logout,
    isAuthenticated: !!teacher,
    attendanceMarked,
    markAttendance,
    radiusVerified,
    setRadiusVerified
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
