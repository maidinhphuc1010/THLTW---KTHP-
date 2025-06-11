import React from 'react';
import { Input } from 'antd';
import BorrowDeviceTable from './BorrowDeviceTable';
import DescriptionModal from './DescriptionModal';
import BorrowModal from './BorrowModal';
import ConfirmModal from './ConfirmModal';
import { useBorrowDevice } from '../../hooks/useBorrowDevice';

const BorrowDevice: React.FC = () => {
  const {
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
    borrowInfo,
    openBorrowModal,
    handleBorrowFormSubmit,
    handleConfirmBorrow,
    currentUser,
  } = useBorrowDevice();

  return (
    <div style={{ padding: 24 }}>
      <h2>Mượn thiết bị</h2>
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm theo tên thiết bị"
          allowClear
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <BorrowDeviceTable
        devices={devices}
        searchText={searchText}
        onOpenBorrow={openBorrowModal}
        onViewDescription={setViewingDescription}
      />

      <DescriptionModal
        description={viewingDescription}
        onClose={() => setViewingDescription('')}
      />

      <BorrowModal
        open={borrowModalOpen}
        device={selectedDevice}
        onClose={() => setBorrowModalOpen(false)}
        onSubmit={handleBorrowFormSubmit}
      />

      <ConfirmModal
        open={confirmModalOpen}
        user={currentUser}
        device={selectedDevice}
        borrowInfo={borrowInfo}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmBorrow}
      />
    </div>
  );
};

export default BorrowDevice;
