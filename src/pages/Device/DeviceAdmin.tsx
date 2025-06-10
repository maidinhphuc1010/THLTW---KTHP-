import React, { useState } from 'react';
import { Button, Table, Modal, Space, message, Input, Tooltip } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import type { ColumnsType } from 'antd/es/table';
import DeviceAdminForm from './DeviceAdminForm';

const DeviceAdmin: React.FC = () => {
  const { data, reload, deleteDevice } = useModel('deviceAdmin');
  const [editingDevice, setEditingDevice] = useState<Device.Info | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [viewingDescription, setViewingDescription] = useState('');
  const [viewingDevice, setViewingDevice] = useState<Device.Info | null>(null);
  const [searchText, setSearchText] = useState('');

  const handleDelete = async (id: string) => {
    try {
      await deleteDevice(id);
      reload();
    } catch (error) {
      message.error('Xoá thất bại');
    }
  };

  const columns: ColumnsType<Device.Info> = [
    {
      title: 'Tên thiết bị',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Loại thiết bị',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Đơn vị quản lý',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: '40%',
      render: (text: string) => {
        const shortDesc = text?.length > 50 ? text.slice(0, 50) + '...' : text;
        return (
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{shortDesc || '—'}</span>
            {text && text.length > 50 && (
              <Tooltip title="Xem mô tả đầy đủ">
                <EyeOutlined
                  onClick={() => setViewingDescription(text)}
                  style={{ color: '#1677ff', cursor: 'pointer' }}
                />
              </Tooltip>
            )}
          </span>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 90,
      render: (_: any, record: Device.Info) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              onClick={() => setViewingDevice(record)}
            />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setEditingDevice(record);
                setOpenForm(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Xoá">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredData = data?.filter((item: Device.Info) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý thiết bị</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm theo tên thiết bị"
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingDevice(null);
            setOpenForm(true);
          }}
        >
          Thêm thiết bị
        </Button>
      </div>

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
      />

      {/* Modal form thêm/sửa */}
      <Modal
        visible={openForm}
        title={editingDevice ? 'Cập nhật thiết bị' : 'Thêm thiết bị'}
        onCancel={() => setOpenForm(false)}
        footer={null}
        destroyOnClose
      >
        <DeviceAdminForm
          initialValues={editingDevice}
          onFinish={() => {
            setOpenForm(false);
            reload();
          }}
        />
      </Modal>

      {/* Modal mô tả thiết bị */}
      <Modal
        visible={!!viewingDescription}
        title="Mô tả thiết bị"
        onCancel={() => setViewingDescription('')}
        footer={null}
      >
        <p style={{ whiteSpace: 'pre-wrap' }}>{viewingDescription || 'Không có mô tả'}</p>
      </Modal>

      {/* Modal chi tiết thiết bị */}
      <Modal
        visible={!!viewingDevice}
        title="Chi tiết thiết bị"
        onCancel={() => setViewingDevice(null)}
        footer={null}
      >
        {viewingDevice && (
          <div>
            <p><strong>Tên:</strong> {viewingDevice.name}</p>
            <p><strong>Loại:</strong> {viewingDevice.type}</p>
            <p><strong>Số lượng:</strong> {viewingDevice.quantity}</p>
            <p><strong>Đơn vị quản lý:</strong> {viewingDevice.department}</p>
            <p><strong>Mô tả:</strong></p>
            <p style={{ whiteSpace: 'pre-wrap' }}>{viewingDevice.description || '—'}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DeviceAdmin;
