import { Table, Tag, Button, Typography, Space, Tooltip, Modal, Input, message } from 'antd'
import { SearchOutlined, EditOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useState, useRef } from 'react'
import type { InputRef } from 'antd'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import Highlighter from 'react-highlight-words'
import type { ColumnType } from 'antd/es/table'
import type { AttendanceParticipant, AttendanceStatus } from '../../types/attendance'
import { useUpdateParticipantStatus } from '../../api/attendanceApi'
import styles from './AttendanceList.module.css'

const { Text } = Typography

type DataIndex = keyof AttendanceParticipant

interface AttendanceListProps {
  participants: AttendanceParticipant[]
  eventId: string
  isEventActive: boolean
  onStatusChange?: () => void
}

export function AttendanceList({ participants, eventId, isEventActive, onStatusChange }: AttendanceListProps) {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [statusModalVisible, setStatusModalVisible] = useState(false)
  const [selectedParticipant, setSelectedParticipant] = useState<AttendanceParticipant | null>(null)
  const [statusNotes, setStatusNotes] = useState('')
  const [messageApi, contextHolder] = message.useMessage()
  const searchInput = useRef<InputRef>(null)
  
  const { mutate: updateStatus, isPending } = useUpdateParticipantStatus()
  
  const statusColors: Record<AttendanceStatus, string> = {
    PENDING: 'default',
    PRESENT: 'success',
    LATE: 'warning',
    ABSENT: 'error'
  }
  
  const statusTexts: Record<AttendanceStatus, string> = {
    PENDING: '대기',
    PRESENT: '출석',
    LATE: '지각',
    ABSENT: '결석'
  }

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<AttendanceParticipant> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`검색`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            검색
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            초기화
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
            }}
          >
            닫기
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value: boolean | React.Key, record: AttendanceParticipant) =>
      (record[dataIndex] || '')
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  })
  
  const handleStatusChange = (participant: AttendanceParticipant) => {
    setSelectedParticipant(participant)
    setStatusNotes(participant.notes || '')
    setStatusModalVisible(true)
  }
  
  const handleConfirmStatus = (status: AttendanceStatus) => {
    if (!selectedParticipant) return
    
    updateStatus(
      { 
        participantId: selectedParticipant.id, 
        eventId: eventId,
        status: status,
        notes: statusNotes
      },
      {
        onSuccess: () => {
          messageApi.success('상태가 업데이트되었습니다.')
          setStatusModalVisible(false)
          if (onStatusChange) onStatusChange()
        },
        onError: () => {
          messageApi.error('상태 업데이트에 실패했습니다.')
        }
      }
    )
  }
  
  const columns = [
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
      sorter: (a: AttendanceParticipant, b: AttendanceParticipant) => a.name.localeCompare(b.name),
    },
    {
      title: '이메일',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email'),
      responsive: ['md'],
    },
    {
      title: '전화번호',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      responsive: ['lg'],
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: '대기', value: 'PENDING' },
        { text: '출석', value: 'PRESENT' },
        { text: '지각', value: 'LATE' },
        { text: '결석', value: 'ABSENT' },
      ],
      onFilter: (value: boolean | React.Key, record: AttendanceParticipant) =>
        record.status === value as string,
      render: (status: AttendanceStatus) => (
        <Tag color={statusColors[status] || 'default'}>
          {statusTexts[status] || status}
        </Tag>
      ),
    },
    {
      title: '출석 시간',
      dataIndex: 'checkInTime',
      key: 'checkInTime',
      render: (time: string | undefined) => time ? new Date(time).toLocaleString('ko-KR') : '-',
      responsive: ['md'],
    },
    {
      title: '메모',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes: string | undefined) => (
        notes ? (
          <Tooltip title={notes}>
            <Text ellipsis style={{ maxWidth: 150 }}>{notes}</Text>
          </Tooltip>
        ) : '-'
      ),
      responsive: ['lg'],
    },
    {
      title: '관리',
      key: 'action',
      render: (_: any, record: AttendanceParticipant) => (
        <Space size="small">
          {isEventActive && (
            <Button 
              icon={<EditOutlined />} 
              size="small" 
              onClick={() => handleStatusChange(record)}
            >
              상태 변경
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      {contextHolder}
      <Table
        dataSource={participants}
        columns={columns as ColumnType<AttendanceParticipant>[]}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        className={styles.table}
      />
      
      <Modal
        title="출석 상태 변경"
        open={statusModalVisible}
        onCancel={() => setStatusModalVisible(false)}
        footer={null}
      >
        <div className={styles.statusButtons}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => handleConfirmStatus('PRESENT')}
              loading={isPending}
              block
              style={{ backgroundColor: '#52c41a' }}
            >
              출석
            </Button>
            
            <Button
              type="primary"
              onClick={() => handleConfirmStatus('LATE')}
              loading={isPending}
              block
              style={{ backgroundColor: '#faad14' }}
            >
              지각
            </Button>
            
            <Button
              danger
              onClick={() => handleConfirmStatus('ABSENT')}
              loading={isPending}
              block
            >
              결석
            </Button>
            
            <div className={styles.notesContainer}>
              <Text strong>메모</Text>
              <Input.TextArea
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                placeholder="상태 변경에 대한 메모를 남겨주세요"
                rows={3}
              />
            </div>
          </Space>
        </div>
      </Modal>
    </div>
  )
} 