import React from 'react';
import { Button, Card } from 'antd';
import { useHistory } from 'umi';

const Dashboard: React.FC = () => {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    history.replace('/simple-login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card style={{ width: 400, textAlign: 'center' }}>
        <h2>Chào mừng đến Dashboard</h2>
        <Button type="primary" danger onClick={handleLogout}>
          Đăng xuất
        </Button>
      </Card>
    </div>
  );
};

export default Dashboard;
