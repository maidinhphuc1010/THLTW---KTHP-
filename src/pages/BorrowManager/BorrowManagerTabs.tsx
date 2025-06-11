import React from 'react';
import { Tabs, Input, Button } from 'antd';
import type { BorrowStatus } from '../../services/Borrow/typings';
import BorrowTable from './BorrowTable';
import * as XLSX from 'xlsx';
import { useBorrowManager } from '../../hooks/useBorrowManager';

const { TabPane } = Tabs;

const BorrowManagerTabs: React.FC = () => {
  const { searchText, setSearchText, updateStatus, getDataByStatus } = useBorrowManager();

  const exportToExcel = (records: any[], filename: string) => {
    const worksheet = XLSX.utils.json_to_sheet(records);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'YeuCauMuon');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const renderTab = (key: BorrowStatus | 'all', label: string) => {
    const filtered = getDataByStatus(key);
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <Input
            placeholder="Tìm theo tên thiết bị"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Button onClick={() => exportToExcel(filtered, `yeu_cau_${key}`)}>Xuất Excel</Button>
        </div>
        <BorrowTable data={filtered} status={key} onUpdateStatus={updateStatus} />
      </div>
    );
  };

  return (
    <div>
      <h2>Quản lý yêu cầu mượn thiết bị</h2>
      <Tabs defaultActiveKey="waiting">
        <TabPane tab="Chờ duyệt" key="waiting">
          {renderTab('waiting', 'Chờ duyệt')}
        </TabPane>
        <TabPane tab="Đang mượn" key="borrowing">
          {renderTab('borrowing', 'Đang mượn')}
        </TabPane>
        <TabPane tab="Đã trả" key="returned">
          {renderTab('returned', 'Đã trả')}
        </TabPane>
        <TabPane tab="Từ chối" key="rejected">
          {renderTab('rejected', 'Từ chối')}
        </TabPane>
        <TabPane tab="Quá hạn" key="overdue">
          {renderTab('overdue', 'Quá hạn')}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default BorrowManagerTabs;
