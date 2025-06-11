import React from 'react';
import { Modal } from 'antd';

interface Props {
  description: string;
  onClose: () => void;
}

const DescriptionModal: React.FC<Props> = ({ description, onClose }) => {
  return (
    <Modal visible={!!description} title="Mô tả thiết bị" footer={null} onCancel={onClose}>
      <p style={{ whiteSpace: 'pre-wrap' }}>{description}</p>
    </Modal>
  );
};

export default DescriptionModal;
