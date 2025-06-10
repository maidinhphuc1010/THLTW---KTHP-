export namespace Student {
  export interface Info {
    fullName: string;
    dateOfBirth: string;
    studentId: string;
    className: string;
    email: string;
    phoneNumber: string;
    cccd: string;
    role?: 'student'; // Thêm trường role để phân quyền
  }

  export interface ShortInfo {
    fullName: string;
    email: string;
    phoneNumber: string;
    studentId: string;
    cccd: string;
    role?: 'student'; // Thêm trường role để phân quyền
  }
}
