import { useEffect, useState } from 'react';
import { message } from 'antd';
import { useModel } from 'umi';
import type { Device } from '@/types/device';
import type { BorrowRecord } from '@/types/borrow';
import dayjs from 'dayjs';

export const useBorrowDevice = () => {
  const { data: devices, updateDevice, reload: reloadDevices } = useModel('deviceAdmin');
  const { createBorrowRecord } = useModel('borrowRecordAdmin');

  const [searchText, setSearchText] = useState('');
  const [viewingDescription, setViewingDescription] = useState('');
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device.Info | null>(null);
  const [borrowInfo, setBorrowInfo] = useState<{ quantity: number; reason: string; returnDate: any } | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; fullName: string } | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(user);
  }, []);

  const openBorrowModal = (device: Device.Info) => {
    setSelectedDevice(device);
    setBorrowModalOpen(true);
  };

  const handleBorrowFormSubmit = (info: { quantity: number; reason: string; returnDate: any }) => {
    setBorrowInfo(info);
    setConfirmModalOpen(true);
  };

  const handleConfirmBorrow = async () => {
    if (!selectedDevice || !currentUser || !borrowInfo) return;

    try {
      const { quantity, reason, returnDate } = borrowInfo;

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
      setBorrowInfo(null);
      reloadDevices();
    } catch (e) {
      console.error(e);
      message.error('Lỗi khi mượn thiết bị.');
    }
  };

  return {
    devices,
    searchText,
    setSearchText,
    viewingDescription,
    setViewingDescription,
    borrowModalOpen,
    setBorrowModalOpen,
    confirmModalOpen,
    setConfirmModalOpen,
    selectedDevice,
    setSelectedDevice,
    borrowInfo,
    setBorrowInfo,
    openBorrowModal,
    handleBorrowFormSubmit,
    handleConfirmBorrow,
    currentUser,
  };
};
