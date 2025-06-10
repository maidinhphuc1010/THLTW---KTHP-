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
  | { success: true; role: 'admin'; data: Admin.Info; message: string }
  | { success: true; role: 'student'; data: Student.Info; message: string }
  | { success: false; message: string };

// Hàm lưu thông tin đăng nhập vào localStorage
const saveLoginInfo = (role: 'admin' | 'student', user: Admin.Info | Student.Info) => {
  localStorage.setItem('isLoggedIn', role);
  localStorage.setItem('currentUser', JSON.stringify(user));
  localStorage.setItem('currentUserEmail', user.email);
};

// Hàm xử lý đăng nhập
export const loginUser = (email: string, cccd: string): LoginResult => {
  const normalized = email.trim().toLowerCase();
  const admins = getAdmins();
  const students = getStudents();

  const admin = admins.find(a => a.email.trim().toLowerCase() === normalized);
  if (admin) {
    if (admin.idCardNumber === cccd) {
      saveLoginInfo('admin', admin);
      return {
        success: true,
        role: 'admin',
        data: admin,
        message: 'Đăng nhập Admin thành công!',
      };
    } else {
      return { success: false, message: 'Sai CCCD cho Admin!' };
    }
  }

  const student = students.find(s => s.email.trim().toLowerCase() === normalized);
  if (student) {
    if (student.cccd === cccd) {
      saveLoginInfo('student', student);
      return {
        success: true,
        role: 'student',
        data: student,
        message: 'Đăng nhập Sinh viên thành công!',
      };
    } else {
      return { success: false, message: 'Sai CCCD cho Sinh viên!' };
    }
  }

  return { success: false, message: 'Tài khoản không tồn tại!' };
};
