export type BorrowStatus = 'waiting' | 'borrowing' | 'overdue' | 'returned' | 'rejected';

export interface Student {
  id: string;
  fullName: string;
  code: string;
  email: string;
  phoneNumber: string;
}

export interface BorrowRecord {
  id: string;
  student: Student;
  userEmail: string;
  deviceName: string;
  borrowDate: string;
  returnDate: string;
  actualReturnDate?: string;
  status: BorrowStatus;
  rejectReason?: string;
  description?: string;
}
