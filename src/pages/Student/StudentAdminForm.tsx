import React from 'react';
import { Form, Input, Button, DatePicker } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';

interface Props {
  onFinish: (isEdit: boolean) => void;
  initialValues?: Student.Info | null;
}

const StudentAdminForm: React.FC<Props> = ({ onFinish, initialValues }) => {
  const [form] = Form.useForm();
  const { addStudent, updateStudent } = useModel('studentAdmin');

  const handleSubmit = async (values: any) => {
    const newStudent: Student.Info = {
      ...values,
      dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'), // chuẩn hóa lại format
    };

    if (initialValues) {
      await updateStudent(newStudent);
      onFinish(true);
    } else {
      await addStudent(newStudent);
      onFinish(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        ...initialValues,
        dateOfBirth: initialValues?.dateOfBirth
          ? moment(initialValues.dateOfBirth)
          : null,
      }}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="studentId"
        label="Mã sinh viên"
        rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="fullName"
        label="Họ tên"
        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="dateOfBirth"
        label="Ngày sinh"
        rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
      >
        <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="className"
        label="Lớp"
        rules={[{ required: true, message: 'Vui lòng nhập tên lớp' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Vui lòng nhập email' },
          { type: 'email', message: 'Email không đúng định dạng' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="phoneNumber"
        label="Số điện thoại"
        rules={[
          { required: true, message: 'Vui lòng nhập số điện thoại' },
          { pattern: /^\d{10}$/, message: 'Số điện thoại phải đúng 10 số' },
        ]}
      >
        <Input maxLength={10} />
      </Form.Item>

      <Form.Item
        name="cccd"
        label="CCCD"
        rules={[
          { required: true, message: 'Vui lòng nhập CCCD' },
          { pattern: /^\d{12}$/, message: 'CCCD phải đúng 12 số' },
        ]}
      >
        <Input maxLength={12} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {initialValues ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default StudentAdminForm;
