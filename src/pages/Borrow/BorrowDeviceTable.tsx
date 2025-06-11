import React from 'react';
import { Button, Table, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface Props {
  devices?: Device.Info[];
  searchText: string;
  onOpenBorrow: (device: Device.Info) => void;
  onViewDescription: (text: string) => void;
}

const BorrowDeviceTable: React.FC<Props> = ({ devices = [], searchText, onOpenBorrow, onViewDescription }) => {
  const filteredDevices = devices.filter(d => d.name.toLowerCase().includes(searchText.toLowerCase()));

  const columns: ColumnsType<Device.Info> = [
    { title: 'Tên thiết bị', dataIndex: 'name', key: 'name' },
    { title: 'Loại thiết bị', dataIndex: 'type', key: 'type' },
    { title: 'Số lượng còn', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Đơn vị quản lý', dataIndex: 'department', key: 'department' },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: text => {
        const short = text?.length > 50 ? text.slice(0, 50) + '...' : text;
        return (
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{short || '—'}</span>
            {text && text.length > 50 && (
              <Tooltip title="Xem mô tả đầy đủ">
                <EyeOutlined style={{ cursor: 'pointer', color: '#1677ff' }} onClick={() => onViewDescription(text)} />
              </Tooltip>
            )}
          </span>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => onOpenBorrow(record)}>Mượn ngay</Button>
      ),
    },
  ];

  return <Table dataSource={filteredDevices} columns={columns} rowKey="id" pagination={{ pageSize: 5 }} bordered />;
};

export default BorrowDeviceTable;
