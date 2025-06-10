import { useState, useEffect } from 'react';
import { message, Modal } from 'antd';

const LOCAL_STORAGE_KEY = 'students';

export default () => {
  const [data, setData] = useState<Student.Info[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    setData(storedData ? JSON.parse(storedData) : []);
  }, []);

  const reload = () => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    setData(storedData ? JSON.parse(storedData) : []);
  };

  const addStudent = (student: Student.Info) => {
    const existing = data.find((s) => s.studentId === student.studentId);

    let updated: Student.Info[];

    if (existing) {
      message.warning('Sinh viên đã tồn tại.');
      return;
    } else {
      updated = [...data, student];
      message.success('Thêm sinh viên thành công.');
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    setData(updated);
  };

  const updateStudent = (student: Student.Info) => {
    const updated = data.map((s) => (s.studentId === student.studentId ? student : s));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    setData(updated);
    message.success('Cập nhật thông tin sinh viên thành công.');
  };

  const deleteStudent = (studentId: string) => {
    Modal.confirm({
      title: 'Xác nhận xoá sinh viên',
      content: 'Bạn có chắc chắn muốn xoá sinh viên này?',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: () => {
        const updated = data.filter((item) => item.studentId !== studentId);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        setData(updated);
        message.success('Đã xoá sinh viên.');
      },
    });
  };

  return {
    data,
    addStudent,
    updateStudent,
    deleteStudent,
    reload,
  };
};
