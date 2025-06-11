// src/hooks/useStudentBorrowHistory.ts
import { useEffect, useState } from 'react';
import type { BorrowRecord } from '../services/Borrow/typings';

export const useStudentBorrowHistory = () => {
  const [data, setData] = useState<BorrowRecord[]>([]);

  useEffect(() => {
    const currentUserRaw = localStorage.getItem('currentUser');
    const borrowDataRaw = localStorage.getItem('borrowData');

    if (currentUserRaw && borrowDataRaw) {
      try {
        const currentUser = JSON.parse(currentUserRaw);
        const borrowData: BorrowRecord[] = JSON.parse(borrowDataRaw);

        const email = currentUser?.email?.trim().toLowerCase();
        if (!email) return;

        const studentRecords = borrowData.filter(
          (record) => record.student?.email?.trim().toLowerCase() === email
        );

        setData(studentRecords);
      } catch (error) {
        console.error('Lỗi khi parse dữ liệu từ localStorage:', error);
      }
    }
  }, []);

  return { data };
};
