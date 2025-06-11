import type { Student as StudentNS } from '../Student/typings';

export type BorrowStatus = 'waiting' | 'borrowing' | 'overdue' | 'returned' | 'rejected';

export interface BorrowRecord {
  id: string;
  student: StudentNS.ShortInfo; // hoặc StudentNS.Info nếu muốn đầy đủ
  userEmail: string;
  deviceName: string;
  borrowDate: string;
  returnDate: string;
  actualReturnDate?: string;
  status: BorrowStatus;
  rejectReason?: string;
  description?: string;
}
