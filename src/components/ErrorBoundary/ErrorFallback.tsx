import styles from './ErrorFallback.module.css'
import type { AppError } from '../../types/error'

interface ErrorFallbackProps {
  error: AppError
}

const ErrorFallback = ({ error }: ErrorFallbackProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>오류가 발생했습니다</h2>
        <p className={styles.message}>{error.message}</p>
        <div className={styles.actions}>
          <button
            onClick={() => window.location.reload()}
            className={styles.retryButton}
          >
            다시 시도
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className={styles.homeButton}
          >
            홈으로 이동
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorFallback 