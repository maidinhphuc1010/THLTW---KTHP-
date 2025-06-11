import React from 'react';
import { Modal, Form, Input, DatePicker } from 'antd';
import dayjs from 'dayjs';

interface Props {
  open: boolean;
  device: Device.Info | null;
  onClose: () => void;
  onSubmit: (info: { quantity: number; reason: string; returnDate: any }) => void;
}

const BorrowModal: React.FC<Props> = ({ open, device, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then(values => onSubmit(values));
  };

  return (
    <Modal
      visible={open}
      title={`Mượn thiết bị: ${device?.name}`}
      onCancel={onClose}
      onOk={handleOk}
      okText="Xác nhận mượn"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="quantity"
          label="Số lượng mượn"
          rules={[{ required: true, message: 'Chọn số lượng' }]}
        >
          <Input type="number" min={1} max={device?.quantity || 1} />
        </Form.Item>

        <Form.Item
          name="reason"
          label="Lý do mượn"
          rules={[{ required: true, message: 'Nhập lý do' }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item
          name="returnDate"
          label="Ngày trả dự kiến"
          rules={[
            { required: true, message: 'Chọn ngày trả' },
            {
              validator: (_, value) => {
                if (!value || value.isAfter(dayjs(), 'day')) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Ngày trả phải lớn hơn ngày hiện tại'));
              },
            },
          ]}
        >
          <DatePicker
            format="DD/MM/YYYY"
            style={{ width: '100%' }}
            disabledDate={current => current && current <= dayjs().endOf('day')}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BorrowModal;
