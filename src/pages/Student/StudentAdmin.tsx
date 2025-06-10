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
import StudentAdminForm from './StudentAdminForm';

const StudentAdmin: React.FC = () => {
  const { data, reload, deleteStudent } = useModel('studentAdmin');
  const [editingStudent, setEditingStudent] = useState<Student.Info | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<Student.Info | null>(null);
  const [searchText, setSearchText] = useState('');

  const handleDelete = async (id: string) => {
    try {
      await deleteStudent(id);
      reload();
    } catch (error) {
      message.error('Xoá thất bại');
    }
  };

  const columns: ColumnsType<Student.Info> = [
    {
      title: 'Mã SV',
      dataIndex: 'studentId',
      key: 'studentId',
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
    },
    {
      title: 'Lớp',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'SĐT',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'CCCD',
      dataIndex: 'cccd',
      key: 'cccd',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Student.Info) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              onClick={() => setViewingStudent(record)}
            />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setEditingStudent(record);
                setOpenForm(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Xoá">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.studentId)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredData = data?.filter((item: Student.Info) =>
    item.fullName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý sinh viên</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm theo tên"
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingStudent(null);
            setOpenForm(true);
          }}
        >
          Thêm sinh viên
        </Button>
      </div>

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="studentId"
        pagination={{ pageSize: 5 }}
        bordered
      />

      <Modal
        visible={openForm}
        title={editingStudent ? 'Cập nhật sinh viên' : 'Thêm sinh viên'}
        onCancel={() => setOpenForm(false)}
        footer={null}
        destroyOnClose
      >
        <StudentAdminForm
          initialValues={editingStudent}
          onFinish={() => {
            setOpenForm(false);
            reload();
          }}
        />
      </Modal>

      <Modal
        visible={!!viewingStudent}
        title="Chi tiết sinh viên"
        onCancel={() => setViewingStudent(null)}
        footer={null}
      >
        {viewingStudent && (
          <div>
            <p><strong>Họ tên:</strong> {viewingStudent.fullName}</p>
            <p><strong>Ngày sinh:</strong> {viewingStudent.dateOfBirth}</p>
            <p><strong>Mã SV:</strong> {viewingStudent.studentId}</p>
            <p><strong>Lớp:</strong> {viewingStudent.className}</p>
            <p><strong>Email:</strong> {viewingStudent.email}</p>
            <p><strong>SĐT:</strong> {viewingStudent.phoneNumber}</p>
            <p><strong>CCCD:</strong> {viewingStudent.cccd}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentAdmin;
