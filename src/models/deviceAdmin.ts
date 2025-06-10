import { useState, useEffect } from 'react';
import { message, Modal } from 'antd';

const LOCAL_STORAGE_KEY = 'devices';

export default () => {
  const [data, setData] = useState<Device.Info[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    setData(storedData ? JSON.parse(storedData) : []);
  }, []);

  const reload = () => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    setData(storedData ? JSON.parse(storedData) : []);
  };

  const addDevice = (device: Device.Info) => {
    const existing = data.find(
      (d) => d.name === device.name && d.type === device.type
    );

    let updated: Device.Info[];

    if (existing) {
      updated = data.map((d) =>
        d.name === device.name && d.type === device.type
          ? { ...d, quantity: d.quantity + device.quantity }
          : d
      );
      message.success('Đã cộng thêm số lượng thiết bị trùng.');
    } else {
      updated = [...data, device];
      message.success('Thêm thiết bị mới thành công.');
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    setData(updated);
  };

  const updateDevice = (device: Device.Info) => {
    const updated = data.map((d) => (d.id === device.id ? device : d));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    setData(updated);
    message.success('Cập nhật thiết bị thành công.');
  };

  const deleteDevice = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xoá thiết bị',
      content: 'Bạn có chắc chắn muốn xoá thiết bị này?',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: () => {
        const updated = data.filter((item) => item.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        setData(updated);
        message.success('Đã xoá thiết bị.');
      },
    });
  };

  return {
    data,
    addDevice,
    updateDevice,
    deleteDevice,
    reload,
  };
};
