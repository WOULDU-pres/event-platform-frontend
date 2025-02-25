import { useNavigate } from 'react-router-dom'
import { Spin, message, Table, Button, Tag, Typography, Radio } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useRaffles } from '../../api/raffleApi'
import styles from './RaffleListPage.module.css'
import type { RaffleEvent, RaffleStatus } from '../../types/raffle'
import { useEffect, useState, useCallback } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

const { Title } = Typography

export function RaffleListPage() {
  const navigate = useNavigate()
  const { data: raffles, isLoading, error } = useRaffles()
  const [messageApi, contextHolder] = message.useMessage()
  const [statusFilter, setStatusFilter] = useState<RaffleStatus | 'all'>('all')
  const [errorShown, setErrorShown] = useState(false)

  const handleRaffleClick = (id: string) => {
    navigate(`/raffles/${id}`)
  }

  const handleCreateClick = () => {
    navigate('/raffles/create')
  }

  const handleStatusChange = (status: RaffleStatus | 'all') => {
    setStatusFilter(status)
  }

  useEffect(() => {
    if (error && !errorShown) {
      messageApi.error('럭키드로우 목록을 불러오는 중 오류가 발생했습니다.')
      setErrorShown(true)
    }
  }, [error, messageApi, errorShown])

  useEffect(() => {
    if (!error) {
      setErrorShown(false)
    }
  }, [error])

  const getStatusTag = useCallback((status: RaffleStatus) => {
    const statusMap: Record<RaffleStatus, { color: string; text: string }> = {
      UPCOMING: { color: 'blue', text: '예정' },
      ACTIVE: { color: 'green', text: '진행중' },
      COMPLETED: { color: 'volcano', text: '완료' },
      CANCELLED: { color: 'grey', text: '취소' },
      DRAFT: { color: 'gold', text: '초안' }
    }
    
    const { color, text } = statusMap[status] || { color: 'default', text: status }
    return <Tag color={color}>{text}</Tag>
  }, [])

  const columns = [
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title',
      render: (_: any, record: RaffleEvent) => (
        <a onClick={() => handleRaffleClick(record.id)}>{record.title}</a>
      )
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (_: any, record: RaffleEvent) => getStatusTag(record.status)
    },
    {
      title: '시작일',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (startDate: string) => {
        try {
          return format(new Date(startDate), 'yyyy.MM.dd HH:mm', { locale: ko });
        } catch (error) {
          console.error('날짜 형식 오류:', startDate, error);
          return '날짜 오류';
        }
      }
    },
    {
      title: '종료일',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (endDate: string) => {
        try {
          return format(new Date(endDate), 'yyyy.MM.dd HH:mm', { locale: ko });
        } catch (error) {
          console.error('날짜 형식 오류:', endDate, error);
          return '날짜 오류';
        }
      }
    },
    {
      title: '참여 현황',
      key: 'participants',
      render: (_: any, record: RaffleEvent) => (
        <span>{record.currentParticipants}/{record.maxParticipants}</span>
      )
    },
    {
      title: '추첨일',
      dataIndex: 'drawDate',
      key: 'drawDate',
      render: (drawDate: string) => {
        try {
          return format(new Date(drawDate), 'yyyy.MM.dd HH:mm', { locale: ko });
        } catch (error) {
          console.error('날짜 형식 오류:', drawDate, error);
          return '날짜 오류';
        }
      }
    }
  ]

  const filteredRaffles = raffles?.filter(raffle => 
    statusFilter === 'all' || raffle.status === statusFilter
  );

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    )
  }

  if (error && !raffles) {
    return (
      <>
        {contextHolder}
        <div className={styles.errorContainer}>
          <p>럭키드로우 목록을 불러오는 중 오류가 발생했습니다.</p>
        </div>
      </>
    )
  }

  return (
    <>
      {contextHolder}
      <div className={styles.container}>
        <div className={styles.header}>
          <Title level={2}>럭키드로우 목록</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleCreateClick}
          >
            새 럭키드로우 만들기
          </Button>
        </div>
        
        <div className={styles.filters}>
          <Radio.Group 
            value={statusFilter} 
            onChange={(e) => handleStatusChange(e.target.value)}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="all">전체</Radio.Button>
            <Radio.Button value="UPCOMING">예정</Radio.Button>
            <Radio.Button value="ACTIVE">진행중</Radio.Button>
            <Radio.Button value="COMPLETED">완료</Radio.Button>
            <Radio.Button value="DRAFT">초안</Radio.Button>
          </Radio.Group>
        </div>

        <Table 
          columns={columns}
          dataSource={filteredRaffles || []}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          className={styles.table}
          loading={isLoading}
        />
      </div>
    </>
  )
}