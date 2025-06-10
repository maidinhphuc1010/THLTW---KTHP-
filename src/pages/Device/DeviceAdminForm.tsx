import React from 'react';
import { Form, Input, InputNumber, Button } from 'antd';
import { useModel } from 'umi';

interface Props {
  onFinish: (isEdit: boolean) => void;
  initialValues?: Device.Info | null;
}

const DeviceAdminForm: React.FC<Props> = ({ onFinish, initialValues }) => {
  const [form] = Form.useForm();
  const { addDevice, updateDevice } = useModel('deviceAdmin');

  const handleSubmit = async (values: Device.Info) => {
    const newData: Device.Info = {
      ...values,
      id: initialValues?.id || Date.now().toString(),
    };

    if (initialValues) {
      await updateDevice(newData);
      onFinish(true); // đã cập nhật
    } else {
      await addDevice(newData);
      onFinish(false); // thêm mới
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues || {}}
      onFinish={handleSubmit}
    >
      <Form.Item name="name" label="Tên thiết bị" rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="type" label="Loại thiết bị" rules={[{ required: true, message: 'Vui lòng nhập loại thiết bị' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="quantity" label="Số lượng" rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="department" label="Đơn vị quản lý" rules={[{ required: true, message: 'Vui lòng nhập đơn vị quản lý' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="description" label="Mô tả">
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {initialValues ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DeviceAdminForm;
