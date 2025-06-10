import React, { useState, useEffect } from 'react';
import {
  Button, Table, Modal, message, Input, Tooltip, DatePicker, Form,
} from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { Device } from '@/types/device';
import type { BorrowRecord } from '@/types/borrow';

const BorrowDevice: React.FC = () => {
  const { data: devices, updateDevice, reload: reloadDevices } = useModel('deviceAdmin');
  const { createBorrowRecord } = useModel('borrowRecordAdmin');

  const [viewingDescription, setViewingDescription] = useState('');
  const [searchText, setSearchText] = useState('');
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device.Info | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; fullName: string } | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(user);
  }, []);

  const openBorrowModal = (device: Device.Info) => {
    setSelectedDevice(device);
    setBorrowModalOpen(true);
    form.resetFields();
  };

  const handleBorrowNow = () => {
    form.validateFields().then(() => setConfirmModalOpen(true));
  };

  const handleConfirmBorrow = async () => {
    try {
      const values = form.getFieldsValue();
      if (!selectedDevice || !currentUser) return;

      const { quantity, reason, returnDate } = values;
      if (quantity > selectedDevice.quantity) {
        message.error(`Không đủ số lượng thiết bị "${selectedDevice.name}"`);
        setConfirmModalOpen(false);
        return;
      }

      const updated = { ...selectedDevice, quantity: selectedDevice.quantity - quantity };
      await updateDevice(updated);

      const newRecord: BorrowRecord = {
        id: `${Date.now()}`,
        student: {
          id: currentUser.id,
          fullName: currentUser.fullName,
          code: currentUser.id,
          email: currentUser.email,
          phoneNumber: '',
        },
        deviceName: selectedDevice.name,
        borrowDate: dayjs().format('YYYY-MM-DD'),
        returnDate: returnDate.format('YYYY-MM-DD'),
        status: 'waiting',
        description: reason,
      };

      await createBorrowRecord(newRecord);
      message.success('Yêu cầu mượn đã được gửi, chờ duyệt.');
      setBorrowModalOpen(false);
      setConfirmModalOpen(false);
      reloadDevices();
    } catch (e) {
      console.error(e);
      message.error('Lỗi khi mượn thiết bị.');
    }
  };

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
                <EyeOutlined style={{ cursor: 'pointer', color: '#1677ff' }} onClick={() => setViewingDescription(text)} />
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
        <Button type="link" onClick={() => openBorrowModal(record)}>Mượn ngay</Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Mượn thiết bị</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="Tìm theo tên thiết bị"
          allowClear
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
      <Table
        dataSource={devices?.filter(d => d.name.toLowerCase().includes(searchText.toLowerCase()))}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
      />

      <Modal
        open={!!viewingDescription}
        title="Mô tả thiết bị"
        footer={null}
        onCancel={() => setViewingDescription('')}
      >
        <p style={{ whiteSpace: 'pre-wrap' }}>{viewingDescription}</p>
      </Modal>

      <Modal
        open={borrowModalOpen}
        title={`Mượn thiết bị: ${selectedDevice?.name}`}
        onCancel={() => setBorrowModalOpen(false)}
        onOk={handleBorrowNow}
        okText="Xác nhận mượn"
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="quantity" label="Số lượng mượn" rules={[{ required: true, message: 'Chọn số lượng' }]}>
            <Input type="number" min={1} max={selectedDevice?.quantity || 1} />
          </Form.Item>
          <Form.Item name="reason" label="Lý do mượn" rules={[{ required: true, message: 'Nhập lý do' }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="returnDate" label="Ngày trả dự kiến" rules={[{ required: true, message: 'Chọn ngày trả' }]}>
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={confirmModalOpen}
        title="Xác nhận mượn"
        onCancel={() => setConfirmModalOpen(false)}
        onOk={handleConfirmBorrow}
        okText="Xác nhận"
      >
        <p><b>Người mượn:</b> {currentUser?.fullName} ({currentUser?.email})</p>
        <p><b>Thiết bị:</b> {selectedDevice?.name}</p>
        <p><b>Số lượng:</b> {form.getFieldValue('quantity')}</p>
        <p><b>Lý do:</b> {form.getFieldValue('reason')}</p>
        <p><b>Trả dự kiến:</b> {form.getFieldValue('returnDate')?.format('DD/MM/YYYY')}</p>
      </Modal>
    </div>
  );
};

export default BorrowDevice;
