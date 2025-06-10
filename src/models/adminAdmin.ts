import { useState, useEffect } from 'react';
import { message, Modal } from 'antd';

const LOCAL_STORAGE_KEY = 'admins';

export default () => {
  const [data, setData] = useState<Admin.Info[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    setData(stored ? JSON.parse(stored) : []);
  }, []);

  const reload = () => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    setData(stored ? JSON.parse(stored) : []);
  };

  const addAdmin = (admin: Omit<Admin.Info, 'adminId' | 'employeeId'>) => {
    const phone = admin.phoneNumber.trim();
    const idCard = admin.idCardNumber.trim();

    if (phone.length !== 10 || idCard.length !== 12) {
      message.error('Số điện thoại hoặc CCCD không hợp lệ.');
      return;
    }

    const adminId = `ADMIN${phone.slice(-4)}`;
    const employeeId = `NV${idCard.slice(-5)}`;

    const exists = data.find(
      (a) => a.adminId === adminId || a.employeeId === employeeId,
    );
    if (exists) {
      message.warning('Admin hoặc mã nhân viên đã tồn tại.');
      return;
    }

    const newAdmin: Admin.Info = {
      ...admin,
      adminId,
      employeeId,
    };

    const updated = [...data, newAdmin];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    setData(updated);
    message.success('Thêm admin thành công.');
  };

  const updateAdmin = (admin: Admin.Info) => {
    const phone = admin.phoneNumber.trim();
    const idCard = admin.idCardNumber.trim();

    if (phone.length !== 10 || idCard.length !== 12) {
      message.error('Số điện thoại hoặc CCCD không hợp lệ.');
      return;
    }

    const newAdminId = `ADMIN${phone.slice(-4)}`;
    const newEmployeeId = `NV${idCard.slice(-5)}`;

    // Kiểm tra trùng (ngoại trừ chính admin này)
    const exists = data.find(
      (a) =>
        (a.adminId === newAdminId || a.employeeId === newEmployeeId) &&
        a.adminId !== admin.adminId,
    );
    if (exists) {
      message.warning('Mã admin hoặc mã nhân viên mới đã tồn tại.');
      return;
    }

    const updatedAdmin: Admin.Info = {
      ...admin,
      adminId: newAdminId,
      employeeId: newEmployeeId,
    };

    const updated = data.map((a) =>
      a.adminId === admin.adminId ? updatedAdmin : a,
    );
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    setData(updated);
    message.success('Cập nhật admin thành công.');
  };

  const deleteAdmin = (adminId: string) => {
    Modal.confirm({
      title: 'Xác nhận xoá admin',
      content: 'Bạn có chắc chắn muốn xoá?',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: () => {
        const updated = data.filter((a) => a.adminId !== adminId);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        setData(updated);
        message.success('Đã xoá admin.');
      },
    });
  };

  return {
    data,
    addAdmin,
    updateAdmin,
    deleteAdmin,
    reload,
  };
};
