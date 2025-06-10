import React, { useState } from 'react';
import { Button, Table, Modal, Space, Input, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { ColumnsType } from 'antd/es/table';
import AdminForm from './AdminForm';

const AdminAdmin: React.FC = () => {
  const { data, reload, deleteAdmin } = useModel('adminAdmin');
  const [editing, setEditing] = useState<Admin.Info | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [viewing, setViewing] = useState<Admin.Info | null>(null);
  const [searchText, setSearchText] = useState('');

  const columns: ColumnsType<Admin.Info> = [
    { title: 'Mã Admin', dataIndex: 'adminId' },
    { title: 'Tên', dataIndex: 'fullName' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'SĐT', dataIndex: 'phoneNumber' },
    { title: 'CCCD', dataIndex: 'idCardNumber' },
    { title: 'Địa chỉ', dataIndex: 'address' },
    { title: 'Mã NV', dataIndex: 'employeeId' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem"><Button icon={<EyeOutlined />} onClick={() => setViewing(record)} /></Tooltip>
          <Tooltip title="Sửa"><Button icon={<EditOutlined />} onClick={() => { setEditing(record); setOpenForm(true); }} /></Tooltip>
          <Tooltip title="Xoá"><Button danger icon={<DeleteOutlined />} onClick={() => deleteAdmin(record.adminId)} /></Tooltip>
        </Space>
      )
    },
  ];

  const filtered = data.filter((a) => a.fullName.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý Admin</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Input.Search placeholder="Tìm theo tên" onChange={(e) => setSearchText(e.target.value)} style={{ width: 300 }} />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); setOpenForm(true); }}>Thêm Admin</Button>
      </div>
      <Table dataSource={filtered} columns={columns} rowKey="adminId" pagination={{ pageSize: 5 }} bordered />

      <Modal visible={openForm} title={editing ? 'Cập nhật Admin' : 'Thêm Admin'} footer={null} onCancel={() => setOpenForm(false)} destroyOnClose>
        <AdminForm initialValues={editing} onFinish={() => { setOpenForm(false); reload(); }} />
      </Modal>

      <Modal visible={!!viewing} title="Chi tiết Admin" onCancel={() => setViewing(null)} footer={null}>
        {viewing && (
          <div>
            <p><b>Tên:</b> {viewing.fullName}</p>
            <p><b>Email:</b> {viewing.email}</p>
            <p><b>SĐT:</b> {viewing.phoneNumber}</p>
            <p><b>CCCD:</b> {viewing.idCardNumber}</p>
            <p><b>Địa chỉ:</b> {viewing.address}</p>
            <p><b>Mã nhân viên:</b> {viewing.employeeId}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminAdmin;
