import { Card, Typography, Row, Col, Statistic, Progress, Divider, Table, Empty } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, UserOutlined } from '@ant-design/icons'
import { Line } from '@ant-design/charts'
import type { AttendanceStatistics as StatisticsData } from '../../types/attendance'
import styles from './AttendanceStatistics.module.css'

const { Title, Text } = Typography

interface AttendanceStatisticsProps {
  statistics: StatisticsData
  eventTitle?: string
}

export function AttendanceStatistics({ statistics, eventTitle }: AttendanceStatisticsProps) {
  const { 
    totalParticipants, 
    presentCount, 
    lateCount, 
    absentCount, 
    presentRate, 
    participationRate,
    dailyAttendance = [] // participantsByDate 대신 dailyAttendance 사용
  } = statistics

  // 날짜별 참여자 데이터를 차트에 사용할 형식으로 변환
  const chartData = dailyAttendance.map(item => ({
    date: item.date,
    참석자수: item.count
  }))

  // 차트 구성
  const config = {
    data: chartData,
    xField: 'date',
    yField: '참석자수',
    color: '#1890ff',
    point: {
      size: 5,
      shape: 'diamond',
    },
    lineStyle: {
      stroke: '#1890ff',
      lineWidth: 2,
    },
    xAxis: {
      title: { text: '날짜' },
    },
    yAxis: {
      title: { text: '참석자 수' },
    },
    meta: {
      '참석자수': {
        alias: '참석자 수',
      },
    },
  }

  // 출석 상태별 데이터
  const statusData = [
    { status: '출석', count: presentCount, color: '#52c41a' },
    { status: '지각', count: lateCount, color: '#faad14' },
    { status: '결석', count: absentCount, color: '#f5222d' },
  ]

  // 데이터가 없을 경우 처리
  const noData = totalParticipants === 0

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Title level={3}>{eventTitle ? `${eventTitle} 통계` : '출석체크 통계'}</Title>
        
        <Row gutter={16} className={styles.statsRow}>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="총 참가자"
              value={totalParticipants}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="출석"
              value={presentCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix={`(${Math.round(presentRate)}%)`}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="지각"
              value={lateCount}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
              suffix={`(${Math.round((lateCount / totalParticipants) * 100) || 0}%)`}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="결석"
              value={absentCount}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#f5222d' }}
              suffix={`(${Math.round((absentCount / totalParticipants) * 100) || 0}%)`}
            />
          </Col>
        </Row>
        
        <Divider />
        
        <Row gutter={16} className={styles.progressRow}>
          <Col xs={24} md={12}>
            <div className={styles.progressItem}>
              <Text strong>참여율</Text>
              <Progress
                percent={Math.round(participationRate * 100)}
                status="active"
                strokeColor="#1890ff"
              />
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className={styles.progressItem}>
              <Text strong>출석률</Text>
              <Progress
                percent={Math.round(presentRate)}
                status="success"
                strokeColor="#52c41a"
              />
            </div>
          </Col>
        </Row>
        
        <Divider />
        
        <div className={styles.chartContainer}>
          <Title level={4}>날짜별 참석 추이</Title>
          {noData ? (
            <Empty description="데이터가 충분하지 않습니다" />
          ) : (
            <Line {...config} />
          )}
        </div>
        
        <Divider />
        
        <div className={styles.tableContainer}>
          <Title level={4}>출석 상태 요약</Title>
          <Table
            dataSource={statusData}
            pagination={false}
            rowKey="status"
            columns={[
              {
                title: '상태',
                dataIndex: 'status',
                key: 'status',
                render: (text, record) => (
                  <Text style={{ color: record.color }} strong>{text}</Text>
                ),
              },
              {
                title: '인원',
                dataIndex: 'count',
                key: 'count',
              },
              {
                title: '비율',
                key: 'rate',
                render: (_, record) => {
                  const rate = totalParticipants > 0 
                    ? Math.round((record.count / totalParticipants) * 100)
                    : 0
                  return `${rate}%`
                }
              },
            ]}
          />
        </div>
      </Card>
    </div>
  )
} 