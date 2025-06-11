import React from 'react';
import { Modal } from 'antd';

interface Props {
  open: boolean;
  user: { fullName: string; email: string } | null;
  device: Device.Info | null;
  borrowInfo: { quantity: number; reason: string; returnDate: any } | null;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmModal: React.FC<Props> = ({ open, user, device, borrowInfo, onClose, onConfirm }) => {
  return (
    <Modal visible={open} title="Xác nhận mượn" onCancel={onClose} onOk={onConfirm} okText="Xác nhận">
      <p><b>Người mượn:</b> {user?.fullName} ({user?.email})</p>
      <p><b>Thiết bị:</b> {device?.name}</p>
      <p><b>Số lượng:</b> {borrowInfo?.quantity}</p>
      <p><b>Lý do:</b> {borrowInfo?.reason}</p>
      <p><b>Trả dự kiến:</b> {borrowInfo?.returnDate?.format('DD/MM/YYYY')}</p>
    </Modal>
  );
};

export default ConfirmModal;
