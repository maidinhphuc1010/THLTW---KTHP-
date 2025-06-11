// src/pages/SimpleLogin.tsx
import React from 'react';
import { Form, Input, Button } from 'antd';
import { useLogin } from '../../hooks/useLogin';

const SimpleLogin: React.FC = () => {
  const { loading, handleLogin } = useLogin();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    }}>
      <Form layout="vertical" onFinish={handleLogin} style={{ width: 300 }}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: 'Nhập mật khẩu!' },
            { min: 4, message: 'Mật khẩu ít nhất 4 ký tự!' },
          ]}
        >
          <Input.Password placeholder="Mật khẩu" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SimpleLogin;
