import React from 'react';
import { Modal, Descriptions } from 'antd';
import type { Device } from '@/types';
import type { FormInstance } from 'antd';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  device: Device.Info | null;
  form: FormInstance;
}

const BorrowConfirmModal: React.FC<Props> = ({
  visible,
  onCancel,
  onOk,
  device,
  form,
}) => {
  const values = form.getFieldsValue();
  const role = localStorage.getItem('isLoggedIn');
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  return (
    <Modal
      visible={visible}
      title="Xác nhận thông tin mượn"
      onCancel={onCancel}
      onOk={onOk}
      okText="Xác nhận"
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Họ tên">{user?.fullName || '—'}</Descriptions.Item>
        <Descriptions.Item label="Email">{user?.email || '—'}</Descriptions.Item>
        <Descriptions.Item label="Vai trò">
          {role === 'admin' ? 'Quản trị viên' : 'Sinh viên'}
        </Descriptions.Item>
        {role === 'student' && (
          <>
            <Descriptions.Item label="MSSV">{user?.studentId || '—'}</Descriptions.Item>
            <Descriptions.Item label="Lớp">{user?.className || '—'}</Descriptions.Item>
          </>
        )}
        {role === 'admin' && (
          <Descriptions.Item label="CCCD">{user?.idCardNumber || '—'}</Descriptions.Item>
        )}
        <Descriptions.Item label="Thiết bị">{device?.name}</Descriptions.Item>
        <Descriptions.Item label="Số lượng mượn">{values.quantity}</Descriptions.Item>
        <Descriptions.Item label="Lý do mượn">{values.reason}</Descriptions.Item>
        <Descriptions.Item label="Ngày trả dự kiến">
          {values.returnDate ? values.returnDate.format('DD/MM/YYYY') : ''}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default BorrowConfirmModal;
