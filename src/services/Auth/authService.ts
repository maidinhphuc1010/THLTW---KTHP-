import { Admin, Student } from '@/types';

export const ADMIN_KEY = 'admins';
export const STUDENT_KEY = 'students';

export const getAdmins = (): Admin.Info[] => {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_KEY) || '[]');
  } catch {
    return [];
  }
};

export const getStudents = (): Student.Info[] => {
  try {
    return JSON.parse(localStorage.getItem(STUDENT_KEY) || '[]');
  } catch {
    return [];
  }
};

export type LoginResult =
  | { success: true; role: 'admin' | 'student'; data: Admin.Info | Student.Info; message: string }
  | { success: false; message: string };

const saveLoginInfo = (role: 'admin' | 'student', user: Admin.Info | Student.Info) => {
  localStorage.setItem('isLoggedIn', role);
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const loginUser = (email: string, cccd: string): LoginResult => {
  const normalized = email.trim().toLowerCase();
  const admins = getAdmins();
  const students = getStudents();

  const admin = admins.find(a => a.email.trim().toLowerCase() === normalized);
  if (admin) {
    if (admin.idCardNumber === cccd) {
      saveLoginInfo('admin', admin);
      return { success: true, role: 'admin', data: admin, message: 'Đăng nhập Admin thành công!' };
    } else {
      return { success: false, message: 'Sai CCCD cho Admin!' };
    }
  }

  const student = students.find(s => s.email.trim().toLowerCase() === normalized);
  if (student) {
    if (student.cccd === cccd) {
      saveLoginInfo('student', student);
      return { success: true, role: 'student', data: student, message: 'Đăng nhập Sinh viên thành công!' };
    } else {
      return { success: false, message: 'Sai CCCD cho Sinh viên!' };
    }
  }

  return { success: false, message: 'Tài khoản không tồn tại!' };
};

export const getCurrentUser = (): Admin.Info | Student.Info | null => {
  try {
    const raw = localStorage.getItem('currentUser');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getUserRole = (): 'admin' | 'student' | null => {
  const role = localStorage.getItem('isLoggedIn');
  return role === 'admin' || role === 'student' ? role : null;
};

export const isAdmin = (user: any): user is Admin.Info => {
  return user && 'adminId' in user;
};

export const isStudent = (user: any): user is Student.Info => {
  return user && 'studentId' in user;
};

export const logout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('currentUser');
};
