import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { useHistory } from 'umi';
import { loginUser } from '../../services/Auth/authService';

const { Title, Text } = Typography;

const SimpleLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'admin') history.replace('/admin-admin');
    else if (isLoggedIn === 'student') history.replace('/student-admin');
  }, [history]);

  const onFinish = (values: any) => {
    setLoading(true);
    const result = loginUser(values.email, values.cccd);
    if (result.success) {
      message.success(result.message);
      history.push(result.role === 'admin' ? '/admin-admin' : '/student-admin');
    } else {
      message.error(result.message);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16
    }}>
      <Card title="Đăng nhập qua CCCD" style={{ maxWidth: 400, width: '100%' }}>
        <Title level={4}>Vui lòng nhập email và số CCCD</Title>
        <Text type="secondary">
          Số CCCD bạn đăng ký sẽ được dùng làm mật khẩu.
        </Text>
        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 16 }}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input placeholder="Email đăng ký" />
          </Form.Item>
          <Form.Item
            name="cccd"
            label="Số CCCD"
            rules={[
              { required: true, message: 'Nhập số CCCD!' },
              { pattern: /^\d{9,12}$/, message: 'CCCD chỉ gồm 9–12 chữ số.' },
            ]}
          >
            <Input.Password placeholder="Số CCCD làm mật khẩu" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SimpleLogin;
