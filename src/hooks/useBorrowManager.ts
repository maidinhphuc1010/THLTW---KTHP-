import { useState, useEffect } from 'react';
import type { BorrowRecord, BorrowStatus } from '../../services/Borrow/typings';
import { message } from 'antd';

export const useBorrowManager = () => {
  const [data, setData] = useState<BorrowRecord[]>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('borrowData');
    const parsed: BorrowRecord[] = stored ? JSON.parse(stored) : [];
    setData(parsed);
  }, []);

  const updateStatus = (id: string, newStatus: BorrowStatus, reason?: string) => {
    const newData = data.map((record) =>
      record.id === id
        ? {
            ...record,
            status: newStatus,
            ...(newStatus === 'rejected' && reason ? { rejectReason: reason } : {}),
          }
        : record
    );
    localStorage.setItem('borrowData', JSON.stringify(newData));
    setData(newData);
    message.success('Cập nhật trạng thái thành công!');
  };

  const getDataByStatus = (status: BorrowStatus | 'all') => {
    const filtered = status === 'all' ? data : data.filter((item) => item.status === status);
    return filtered.filter((record) =>
      record.deviceName.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  return {
    data,
    searchText,
    setSearchText,
    updateStatus,
    getDataByStatus,
  };
};
