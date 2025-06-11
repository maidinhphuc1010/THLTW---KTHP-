// src/hooks/useLogin.ts
import { useEffect, useState } from 'react';
import { useHistory } from 'umi';
import { message } from 'antd';
import { loginUser } from '../services/Auth/authService';

export const useLogin = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'admin') history.replace('/admin-admin');
    else if (isLoggedIn === 'student') history.replace('/student-admin');
  }, [history]);

// Trong useLogin
const handleLogin = async (values: { email: string; password: string }) => {
  setLoading(true);
  const result = await loginUser(values.email, values.password);

  if (result.success) {
    const currentCount = parseInt(localStorage.getItem('loginCount') || '0');
    localStorage.setItem('loginCount', (currentCount + 1).toString());
    
    message.success(result.message);
    history.push(result.role === 'admin' ? '/admin-admin' : '/student-admin');
  } else {
    message.error(result.message);
  }

  setLoading(false);
};


  return { loading, handleLogin };
};
