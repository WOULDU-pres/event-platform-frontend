import styles from './Pagination.module.css'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  
  return (
    <div className={styles.pagination}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.pageButton}
      >
        이전
      </button>
      
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.pageButton}
      >
        다음
      </button>
    </div>
  )
} 