import React from 'react';
import { Button, Card, Descriptions } from 'antd';
import { useHistory } from 'umi';
import { getCurrentUser, isAdmin, isStudent, logout } from '../../services/Auth/authService';

const Dashboard: React.FC = () => {
  const history = useHistory();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    history.replace('/simple-login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card style={{ width: 500 }}>
        <h2 style={{ textAlign: 'center' }}>Chào mừng đến Dashboard</h2>

        {user ? (
          <Descriptions bordered column={1} size="middle" style={{ marginBottom: 20 }}>
            {isAdmin(user) && (
              <>
                <Descriptions.Item label="Vai trò">Quản trị viên</Descriptions.Item>
                <Descriptions.Item label="Tên">{user.name}</Descriptions.Item>
                <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                <Descriptions.Item label="Số CCCD">{user.idCardNumber}</Descriptions.Item>
                <Descriptions.Item label="Mã quản trị viên">{user.adminId}</Descriptions.Item>
              </>
            )}

            {isStudent(user) && (
              <>
                <Descriptions.Item label="Vai trò">Sinh viên</Descriptions.Item>
                <Descriptions.Item label="Tên">{user.name}</Descriptions.Item>
                <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                <Descriptions.Item label="Số CCCD">{user.cccd}</Descriptions.Item>
                <Descriptions.Item label="Mã sinh viên">{user.studentId}</Descriptions.Item>
                <Descriptions.Item label="Lớp">{user.className}</Descriptions.Item>
              </>
            )}
          </Descriptions>
        ) : (
          <p style={{ textAlign: 'center' }}>Không tìm thấy thông tin người dùng!</p>
        )}

        <div style={{ textAlign: 'center' }}>
          <Button type="primary" danger onClick={handleLogout}>
            Đăng xuất
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
