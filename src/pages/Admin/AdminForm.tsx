import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useModel } from 'umi';

interface Props {
  initialValues?: Admin.Info | null;
  onFinish: () => void;
}

const AdminForm: React.FC<Props> = ({ initialValues, onFinish }) => {
  const [form] = Form.useForm();
  const { addAdmin, updateAdmin } = useModel('adminAdmin');

  // Reset form mỗi lần initialValues thay đổi
  useEffect(() => {
    form.resetFields();
  }, [initialValues, form]);

  const handleSubmit = async (values: Admin.Info) => {
    if (initialValues) {
      // Gộp dữ liệu cũ với dữ liệu mới
      await updateAdmin({ ...initialValues, ...values });
    } else {
      await addAdmin(values);
    }
    onFinish();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues || {}}
      onFinish={handleSubmit}
    >
      <Form.Item name="fullName" label="Họ tên" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true },
          { type: 'email', message: 'Email không hợp lệ' },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phoneNumber"
        label="SĐT"
        rules={[
          { required: true },
          {
            pattern: /^\d{10}$/,
            message: 'SĐT phải 10 số',
          },
        ]}
      >
        <Input maxLength={10} />
      </Form.Item>
      <Form.Item
        name="idCardNumber"
        label="CCCD"
        rules={[
          { required: true },
          {
            pattern: /^\d{12}$/,
            message: 'CCCD phải 12 số',
          },
        ]}
      >
        <Input maxLength={12} />
      </Form.Item>
      <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {initialValues ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AdminForm;
