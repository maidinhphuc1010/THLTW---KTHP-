import React from 'react';
import { Table, Tag, Button, Modal, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { BorrowRecord, BorrowStatus } from '../../services/Borrow/typings';
import { statusColors, statusLabels } from '../../services/Borrow/constants';
import dayjs from 'dayjs';
import { useBorrowTableLogic } from '../../hooks/useBorrowTableLogic';

interface BorrowTableProps {
  data: BorrowRecord[];
  status: BorrowStatus | 'all';
  onUpdateStatus: (id: string, status: BorrowStatus, reason?: string) => void;
}

const BorrowTable: React.FC<BorrowTableProps> = ({ data, status, onUpdateStatus }) => {
  const {
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
  } = useBorrowTableLogic(onUpdateStatus);

  const columns: ColumnsType<BorrowRecord> = [
    { title: 'Họ tên', dataIndex: ['student', 'fullName'], align: 'center' },
    { title: 'Mã SV', dataIndex: ['student', 'studentId'], align: 'center' },
    { title: 'SĐT', dataIndex: ['student', 'phoneNumber'], align: 'center' },
    { title: 'Thiết bị', dataIndex: 'deviceName', align: 'center' },
    {
      title: 'Ngày mượn',
      dataIndex: 'borrowDate',
      align: 'center',
      render: (date: string) =>
        dayjs(date).isValid() ? dayjs(date).format('DD/MM/YYYY HH:mm') : 'Không hợp lệ',
    },
    {
      title: 'Ngày trả',
      dataIndex: 'returnDate',
      align: 'center',
      render: (date: string) =>
        dayjs(date).isValid() ? dayjs(date).format('DD/MM/YYYY') : 'Không hợp lệ',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      align: 'center',
      render: (_, record) => (
        <Tag color={statusColors[record.status]}>
          {statusLabels[record.status]}
        </Tag>
      ),
    },
  ];

  if (status === 'rejected') {
    columns.push({
      title: 'Lý do từ chối',
      dataIndex: 'rejectReason',
      align: 'center',
      render: (text: string) => text || 'Không có',
    });
  }

  if (status !== 'returned' && status !== 'rejected') {
    columns.push({
      title: 'Thao tác',
      align: 'center',
      render: (_, record) => {
        if (record.status === 'waiting') {
          return (
            <>
              <Button type="link" onClick={() => handleApprove(record)}>Duyệt</Button>
              <Button type="link" danger onClick={() => openRejectModal(record)}>Từ chối</Button>
            </>
          );
        }
        if (record.status === 'borrowing') {
          return <Button type="link" onClick={() => handleReturn(record)}>Đã trả</Button>;
        }
        if (record.status === 'overdue') {
          return <Button type="link" onClick={() => handleSendMail(record)}>Gửi mail</Button>;
        }
        return null;
      },
    });
  }

  return (
    <>
      <Table
        rowKey="id"
        dataSource={data}
        columns={columns}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        visible={rejectModalVisible}
        title={`Từ chối yêu cầu mượn "${rejectingRecord?.deviceName}"`}
        onOk={handleRejectConfirm}
        onCancel={() => setRejectModalVisible(false)}
        okText="Từ chối"
        cancelText="Hủy"
      >
        <Input.TextArea
          rows={3}
          placeholder="Nhập lý do từ chối"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default BorrowTable;
