import { useModel } from 'umi';
import type { BorrowRecord } from '@/types/borrow';
import useBorrowRecords from './useBorrowRecords';

export default () => {
  const { data, addBorrowRecord, updateBorrowRecord } = useBorrowRecords();

  return {
    data,
    createBorrowRecord: async (record: BorrowRecord) => {
      addBorrowRecord(record);
    },
    updateBorrowRecord: async (record: BorrowRecord) => {
      updateBorrowRecord(record);
    },
  };
};
