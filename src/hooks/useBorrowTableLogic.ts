import { useState } from 'react';
import type { BorrowRecord, BorrowStatus } from '../../services/Borrow';
import { Modal, message } from 'antd';

export function useBorrowTableLogic(onUpdateStatus: (id: string, status: BorrowStatus, reason?: string) => void) {
  const [rejectReason, setRejectReason] = useState('');
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectingRecord, setRejectingRecord] = useState<BorrowRecord | null>(null);

  const handleApprove = (record: BorrowRecord) => {
    Modal.confirm({
      title: `Duyệt yêu cầu mượn "${record.deviceName}"?`,
      onOk: () => onUpdateStatus(record.id, 'borrowing'),
    });
  };

  const openRejectModal = (record: BorrowRecord) => {
    setRejectingRecord(record);
    setRejectReason('');
    setRejectModalVisible(true);
  };

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) {
      message.warning('Vui lòng nhập lý do từ chối');
      return;
    }

    if (rejectingRecord) {
      onUpdateStatus(rejectingRecord.id, 'rejected', rejectReason);
    }

    setRejectReason('');
    setRejectingRecord(null);
    setRejectModalVisible(false);
  };

  const handleReturn = (record: BorrowRecord) => {
    Modal.confirm({
      title: `Đánh dấu thiết bị "${record.deviceName}" đã trả?`,
      onOk: () => onUpdateStatus(record.id, 'returned'),
    });
  };

  const handleSendMail = (record: BorrowRecord) => {
    message.info(`Đã gửi email nhắc nhở cho ${record.student?.fullName || 'người dùng'}`);
  };

  return {
    rejectReason,
    setRejectReason,
    rejectModalVisible,
    setRejectModalVisible,
    rejectingRecord,
    handleApprove,
    openRejectModal,
    handleRejectConfirm,
    handleReturn,
    handleSendMail,
  };
}
