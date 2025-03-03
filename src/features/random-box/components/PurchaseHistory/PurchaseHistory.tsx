import React, { useState } from 'react'
import { Card, Button, Badge, Input, Select, DatePicker, Spin, Pagination } from 'antd'
import { 
  GiftOutlined, 
  HistoryOutlined, 
  SearchOutlined, 
  FilterOutlined, 
  CalendarOutlined,
  InboxOutlined 
} from '@ant-design/icons'
import { PurchaseHistoryItem } from '../../types'
import { ITEM_CATEGORY_TEXT, ITEM_CATEGORY_COLOR } from '../../constants'
import styles from './PurchaseHistory.module.css'

const { RangePicker } = DatePicker
const { Option } = Select

interface PurchaseHistoryProps {
  items: PurchaseHistoryItem[]
  loading?: boolean
  hasMore?: boolean
  totalCount?: number
  onLoadMore?: () => void
  onPageChange?: (page: number, pageSize?: number) => void
  onItemClick?: (item: PurchaseHistoryItem) => void
  onFilter?: (filters: HistoryFilters) => void
  pageSize?: number
  currentPage?: number
  useInfiniteScroll?: boolean
}

// 필터 옵션 타입
export interface HistoryFilters {
  category?: string
  searchText?: string
  dateRange?: [Date, Date] | null
}

/**
 * 구매 내역 컴포넌트
 * 사용자의 랜덤박스 구매 내역을 표시
 */
const PurchaseHistory: React.FC<PurchaseHistoryProps> = ({
  items,
  loading = false,
  hasMore = false,
  totalCount = 0,
  onLoadMore,
  onPageChange,
  onItemClick,
  onFilter,
  pageSize = 12,
  currentPage = 1,
  useInfiniteScroll = false
}) => {
  // 필터 상태
  const [filters, setFilters] = useState<HistoryFilters>({
    category: undefined,
    searchText: undefined,
    dateRange: null
  })
  
  // 필터 변경 핸들러
  const handleFilterChange = (key: keyof HistoryFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    if (onFilter) {
      onFilter(newFilters)
    }
  }
  
  // 카테고리 필터 변경 핸들러
  const handleCategoryChange = (value: string) => {
    handleFilterChange('category', value === 'all' ? undefined : value)
  }
  
  // 검색어 입력 핸들러
  const handleSearch = (value: string) => {
    handleFilterChange('searchText', value || undefined)
  }
  
  // 날짜 범위 변경 핸들러
  const handleDateRangeChange = (dates: any) => {
    handleFilterChange('dateRange', dates)
  }
  
  // 아이템 클릭 핸들러
  const handleItemClick = (item: PurchaseHistoryItem) => {
    if (onItemClick) {
      onItemClick(item)
    }
  }
  
  // 더 보기 버튼 렌더링
  const renderLoadMoreButton = () => {
    if (!useInfiniteScroll || !hasMore) return null
    
    return (
      <div className={styles.loadMoreContainer}>
        <Button
          className={styles.loadMoreButton}
          loading={loading}
          disabled={!hasMore}
          onClick={onLoadMore}
        >
          더 보기
        </Button>
      </div>
    )
  }
  
  // 페이지네이션 렌더링
  const renderPagination = () => {
    if (useInfiniteScroll || totalCount <= pageSize) return null
    
    return (
      <div className={styles.pagination}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalCount}
          onChange={onPageChange}
          showSizeChanger={false}
        />
      </div>
    )
  }
  
  // 필터 컨트롤 렌더링
  const renderFilters = () => {
    return (
      <div className={styles.filterContainer}>
        <div className={styles.filterLabel}>
          <FilterOutlined /> 카테고리
        </div>
        <Select
          className={styles.filterSelect}
          value={filters.category || 'all'}
          onChange={handleCategoryChange}
          disabled={loading}
        >
          <Option value="all">전체</Option>
          <Option value="physical">실물 상품</Option>
          <Option value="digital">디지털 상품</Option>
          <Option value="coupon">쿠폰</Option>
          <Option value="event">이벤트 아이템</Option>
        </Select>
        
        <Input
          className={styles.searchInput}
          placeholder="아이템 이름 검색"
          prefix={<SearchOutlined />}
          allowClear
          onChange={(e) => handleSearch(e.target.value)}
          disabled={loading}
        />
        
        <RangePicker
          className={styles.dateRangePicker}
          onChange={handleDateRangeChange}
          placeholder={['시작일', '종료일']}
          disabled={loading}
        />
      </div>
    )
  }
  
  // 구매 내역 아이템 카드 렌더링
  const renderHistoryItem = (item: PurchaseHistoryItem) => {
    const acquiredDate = new Date(item.acquiredAt)
    const formattedDate = `${acquiredDate.getFullYear()}-${String(acquiredDate.getMonth() + 1).padStart(2, '0')}-${String(acquiredDate.getDate()).padStart(2, '0')} ${String(acquiredDate.getHours()).padStart(2, '0')}:${String(acquiredDate.getMinutes()).padStart(2, '0')}`
    
    return (
      <Card 
        key={item.id} 
        className={styles.historyCard}
        onClick={() => handleItemClick(item)}
      >
        <div 
          className={styles.cardImage}
          style={item.item.imageUrl ? { backgroundImage: `url(${item.item.imageUrl})` } : undefined}
        >
          {!item.item.imageUrl && (
            <GiftOutlined className={styles.cardImagePlaceholder} />
          )}
        </div>
        
        <div className={styles.cardContent}>
          <h3 className={styles.itemName}>{item.item.name}</h3>
          
          <div className={styles.boxInfo}>
            <HistoryOutlined />
            <span className={styles.boxName}>{item.boxName}</span>
          </div>
          
          <div className={styles.dateInfo}>
            <CalendarOutlined /> {formattedDate}
          </div>
          
          <div className={styles.itemCategory}>
            <Badge
              color={ITEM_CATEGORY_COLOR[item.item.category]}
              text={ITEM_CATEGORY_TEXT[item.item.category]}
            />
          </div>
        </div>
      </Card>
    )
  }
  
  // 빈 상태 렌더링
  const renderEmptyState = () => {
    return (
      <div className={styles.emptyState}>
        <InboxOutlined className={styles.emptyIcon} />
        <div className={styles.emptyText}>아직 구매한 랜덤박스가 없습니다.</div>
        <Button type="primary">랜덤박스 구경하기</Button>
      </div>
    )
  }
  
  // 로딩 상태 렌더링
  const renderLoading = () => {
    return (
      <div className={styles.emptyState}>
        <Spin size="large" />
      </div>
    )
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>내 구매 내역</h2>
        <div className={styles.subTitle}>지금까지 구매한 랜덤박스 내역입니다.</div>
      </div>
      
      {renderFilters()}
      
      {loading && items.length === 0 ? (
        renderLoading()
      ) : items.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className={styles.historyGrid}>
          {items.map(renderHistoryItem)}
        </div>
      )}
      
      {renderLoadMoreButton()}
      {renderPagination()}
    </div>
  )
}

export default PurchaseHistory 