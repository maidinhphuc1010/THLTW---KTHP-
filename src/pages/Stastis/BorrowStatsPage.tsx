import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'antd';
import { useBorrowManager } from '@/hooks/useBorrowManager';
import useDeviceManager from '../../models/deviceAdmin';
import ColumnChart from '../../components/Chart/ColumnChart';
import DonutChart from '../../components/Chart/DonutChart';

const statusLabels: Record<string, string> = {
  waiting: 'Chờ duyệt',
  borrowing: 'Đang mượn',
  returned: 'Đã trả',
  rejected: 'Từ chối',
  overdue: 'Quá hạn',
};

const BorrowStatsPage: React.FC = () => {
  const { data } = useBorrowManager();
  const { data: deviceData } = useDeviceManager();

  const [loginCount, setLoginCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);

  // Thống kê theo trạng thái mượn thiết bị
  const countsByStatus: Record<string, number> = {};
  data.forEach((item) => {
    countsByStatus[item.status] = (countsByStatus[item.status] || 0) + 1;
  });

  const xAxis = Object.values(statusLabels);
  const yAxis = [Object.keys(statusLabels).map((key) => countsByStatus[key] || 0)];
  const yLabel = ['Số lượng'];

  // Tổng số thiết bị (cộng dồn quantity)
  const totalDeviceQuantity = deviceData.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const count = parseInt(localStorage.getItem('loginCount') || '0');
    setLoginCount(count);

    const admins = JSON.parse(localStorage.getItem('admins') || '[]');
    setAdminCount(admins.length);

    const students = JSON.parse(localStorage.getItem('students') || '[]');
    setStudentCount(students.length);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Thống kê</h2>

      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="Biểu đồ cột số lượng theo trạng thái">
            <ColumnChart
              xAxis={xAxis}
              yAxis={yAxis}
              yLabel={yLabel}
              height={350}
              colors={['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1']}
              formatY={(val) => val.toString()}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Biểu đồ donut tỉ lệ trạng thái">
            <DonutChart
              xAxis={xAxis}
              yAxis={yAxis}
              height={350}
              showTotal
              colors={['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1']}
              formatY={(val) => val.toString()}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={6}>
          <Card title="Số lần đăng nhập" bordered={false}>
            <h3 style={{ fontSize: 32, color: '#1890ff' }}>{loginCount}</h3>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Tổng số thiết bị" bordered={false}>
            <h3 style={{ fontSize: 32, color: '#52c41a' }}>{totalDeviceQuantity}</h3>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Số admin" bordered={false}>
            <h3 style={{ fontSize: 32, color: '#faad14' }}>{adminCount}</h3>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Số sinh viên" bordered={false}>
            <h3 style={{ fontSize: 32, color: '#f5222d' }}>{studentCount}</h3>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BorrowStatsPage;
