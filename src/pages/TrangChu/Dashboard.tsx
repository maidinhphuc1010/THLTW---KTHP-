import React, { useEffect, useState } from 'react';
import { Button, Card, Descriptions, Alert } from 'antd';
import { useHistory } from 'umi';
import { getCurrentUser, isAdmin, isStudent, logout } from '../../services/Auth/authService';
import useBorrowRecords from '../../models/useBorrowRecords'; // sửa lại đường dẫn đúng

const Dashboard: React.FC = () => {
  const history = useHistory();
  const user = getCurrentUser();

  const {
    data: borrowRecords,
    isApprovedModalVisible,
    setIsApprovedModalVisible,
    modalMessage, // ✅ lấy nội dung modal (duyệt hoặc từ chối)
  } = useBorrowRecords();

  const [showStudentAlert, setShowStudentAlert] = useState(false);
  const [hasOverdue, setHasOverdue] = useState(false);

  useEffect(() => {
    if (isStudent(user) && isApprovedModalVisible) {
      setShowStudentAlert(true);
      // Ẩn cảnh báo sau 5 giây
      setTimeout(() => {
        setShowStudentAlert(false);
        setIsApprovedModalVisible(false);
      }, 5000);
    }

    if (isAdmin(user)) {
      const hasOverdueRecord = borrowRecords.some(record => record.status === 'overdue');
      setHasOverdue(hasOverdueRecord);
    }
  }, [user, borrowRecords, isApprovedModalVisible]);

  const handleLogout = () => {
    logout();
    history.replace('/simple-login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card style={{ width: 500 }}>
        <h2 style={{ textAlign: 'center' }}>Chào mừng đến Dashboard</h2>

        {/* ✅ Cảnh báo cho sinh viên khi yêu cầu được duyệt hoặc từ chối */}
        {showStudentAlert && (
          <Alert
            message={modalMessage}
            type={modalMessage.includes('từ chối') ? 'error' : 'success'}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {/* ⚠️ Cảnh báo cho admin nếu có thiết bị mượn quá hạn */}
        {hasOverdue && (
          <Alert
            message="Có thiết bị mượn quá hạn!"
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

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
