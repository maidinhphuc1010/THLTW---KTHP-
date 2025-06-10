import React, { useEffect, useState } from 'react';
import { Table, Tag, Typography, Card } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { BorrowRecord } from '../../services/Borrow/typings';

const { Title } = Typography;

const StudentBorrowHistory: React.FC = () => {
  const [data, setData] = useState<BorrowRecord[]>([]);

  // ✅ Lấy email từ currentUser
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const currentEmail = currentUser?.email || '';

  useEffect(() => {
    const raw = localStorage.getItem('borrowData');
    if (raw && currentEmail) {
      const allRecords = JSON.parse(raw) as BorrowRecord[];
      const studentRecords = allRecords.filter(
        record => record.userEmail?.trim().toLowerCase() === currentEmail.trim().toLowerCase()
      );
      setData(studentRecords);
    }
  }, [currentEmail]);

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
      render: (status: string) => {
        let color = 'default';
        if (status === 'borrowing') color = 'blue';
        else if (status === 'waiting') color = 'orange';
        else if (status === 'overdue') color = 'red';
        else if (status === 'returned') color = 'green';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={3}>Lịch sử mượn thiết bị của bạn</Title>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default StudentBorrowHistory;
