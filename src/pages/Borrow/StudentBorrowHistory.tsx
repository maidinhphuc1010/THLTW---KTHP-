import React from 'react';
import { Table, Tag, Typography, Card } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { BorrowRecord, BorrowStatus } from '../../services/Borrow/typings';
import { statusColors, statusLabels } from '../../services/Borrow/constants';
import { useStudentBorrowHistory } from '../../hooks/useStudentBorrowHistory';

const { Title } = Typography;

const StudentBorrowHistory: React.FC = () => {
  const { data } = useStudentBorrowHistory();

  const columns: ColumnsType<BorrowRecord> = [
    {
      title: 'Tên thiết bị',
      dataIndex: 'deviceName',
      key: 'deviceName',
    },
    {
      title: 'Ngày mượn',
      dataIndex: 'borrowDate',
      key: 'borrowDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Ngày trả dự kiến',
      dataIndex: 'returnDate',
      key: 'returnDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Ngày trả thực tế',
      dataIndex: 'actualReturnDate',
      key: 'actualReturnDate',
      render: (date?: string) =>
        date ? new Date(date).toLocaleDateString() : 'Chưa trả',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: BorrowStatus) => (
        <Tag color={statusColors[status] || 'default'}>
          {statusLabels[status] || status}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={3}>Lịch sử mượn thiết bị của bạn</Title>
        <Table columns={columns} dataSource={data} rowKey="id" pagination={{ pageSize: 5 }} />
      </Card>
    </div>
  );
};

export default StudentBorrowHistory;
