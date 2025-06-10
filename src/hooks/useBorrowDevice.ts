// src/hooks/useBorrowDevice.ts
import { useState, useEffect } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import type { Device } from '@/types/device';
import type { BorrowRecord } from '@/types/borrow';
import { useModel } from 'umi';

export const useBorrowDevice = () => {
  const { data: devices, updateDevice, reload: reloadDevices } = useModel('deviceAdmin');
  const { createBorrowRecord } = useModel('borrowRecordAdmin');

  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email: string;
    fullName: string;
  } | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(user);
  }, []);

  const borrowDevice = async (
    values: any,
    selectedDevice: Device.Info | null,
    onSuccess: () => void,
    onFail: () => void,
  ) => {
    try {
      if (!selectedDevice || !currentUser) return;

      const { quantity, reason, returnDate } = values;
      if (quantity > selectedDevice.quantity) {
        message.error(`Không đủ số lượng thiết bị "${selectedDevice.name}"`);
        return onFail();
      }

      const updatedDevice: Device.Info = {
        ...selectedDevice,
        quantity: selectedDevice.quantity - quantity,
      };

      await updateDevice(updatedDevice);

      const newBorrowRecord: BorrowRecord = {
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

      await createBorrowRecord(newBorrowRecord);
      message.success('Yêu cầu mượn đã được gửi, chờ duyệt.');
      onSuccess();
      reloadDevices();
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi mượn thiết bị.');
      onFail();
    }
  };

  return {
    devices,
    currentUser,
    borrowDevice,
  };
};
