import { useEffect, useState } from 'react'
import { Spin, message, Typography, Radio, Button, Input, Row, Col, Empty } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useAttendanceList } from '../../hooks/useAttendance'
import { AttendanceCard } from '../../components/AttendanceCard/AttendanceCard'
import { ATTENDANCE_EVENT_STATUS, ATTENDANCE_ERROR_MESSAGES } from '../../constants/attendanceConstants'
import styles from './AttendanceListPage.module.css'

const { Title } = Typography
const { Search } = Input

export function AttendanceListPage() {
  const {
    events,
    isLoading,
    error,
    statusFilter,
    handleEventClick,
    handleCreateClick,
    handleStatusChange
  } = useAttendanceList()
  const [errorShown, setErrorShown] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredEvents, setFilteredEvents] = useState(events)

  // 이벤트 검색
  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  // 검색 또는 필터 변경 시 이벤트 필터링
  useEffect(() => {
    if (!events) {
      setFilteredEvents([])
      return
    }

    if (!searchTerm) {
      setFilteredEvents(events)
      return
    }

    const lowerCaseTerm = searchTerm.toLowerCase()
    const filtered = events.filter((event) => 
      event.title.toLowerCase().includes(lowerCaseTerm) || 
      event.description.toLowerCase().includes(lowerCaseTerm) ||
      event.location.toLowerCase().includes(lowerCaseTerm)
    )
    setFilteredEvents(filtered)
  }, [events, searchTerm])

  // 에러 처리
  useEffect(() => {
    if (error && !errorShown) {
      messageApi.error(ATTENDANCE_ERROR_MESSAGES.LOAD_EVENTS_FAILED)
      setErrorShown(true)
    }
  }, [error, messageApi, errorShown])

  // 에러 상태 초기화
  useEffect(() => {
    if (!error) {
      setErrorShown(false)
    }
  }, [error])

  return (
    <div className={styles.container}>
      {contextHolder}
      
      <div className={styles.header}>
        <Title level={2}>출석체크 목록</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateClick}
        >
          새 출석체크 만들기
        </Button>
      </div>
      
      <div className={styles.filters}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={12} lg={16}>
            <Radio.Group 
              value={statusFilter} 
              onChange={(e) => handleStatusChange(e.target.value)}
              className={styles.statusFilter}
            >
              <Radio.Button value="all">전체</Radio.Button>
              <Radio.Button value={ATTENDANCE_EVENT_STATUS.UPCOMING}>예정</Radio.Button>
              <Radio.Button value={ATTENDANCE_EVENT_STATUS.ACTIVE}>진행중</Radio.Button>
              <Radio.Button value={ATTENDANCE_EVENT_STATUS.COMPLETED}>완료</Radio.Button>
              <Radio.Button value={ATTENDANCE_EVENT_STATUS.DRAFT}>임시저장</Radio.Button>
            </Radio.Group>
          </Col>
          
          <Col xs={24} sm={24} md={12} lg={8}>
            <Search
              placeholder="출석체크 검색"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              className={styles.searchInput}
            />
          </Col>
        </Row>
      </div>
      
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      ) : filteredEvents && filteredEvents.length > 0 ? (
        <div className={styles.eventList}>
          <Row gutter={[16, 16]}>
            {filteredEvents.map((event) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={event.id}>
                <AttendanceCard 
                  event={event} 
                  onClick={() => handleEventClick(event.id)}
                />
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <div className={styles.emptyContainer}>
          <Empty 
            description={
              searchTerm 
                ? "검색 결과가 없습니다"
                : statusFilter !== 'all'
                  ? "해당 상태의 출석체크가 없습니다"
                  : "등록된 출석체크가 없습니다"
            }
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleCreateClick}
            className={styles.emptyButton}
          >
            새 출석체크 만들기
          </Button>
        </div>
      )}
    </div>
  )
} 