import { useRouteError } from 'react-router-dom'
import styles from './ErrorPage.module.css'
import type { AppError } from '../../types/error'

const ErrorPage = () => {
  const error = useRouteError() as AppError

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span className={`material-icons ${styles.icon}`}>error_outline</span>
        <h1 className={styles.title}>
          {error.code === 'NOT_FOUND' ? '페이지를 찾을 수 없습니다' : '오류가 발생했습니다'}
        </h1>
        <p className={styles.message}>
          {error.message || '요청하신 페이지를 찾을 수 없거나 일시적인 오류가 발생했습니다.'}
        </p>
        <div className={styles.actions}>
          <button
            onClick={() => window.location.reload()}
            className={styles.retryButton}
          >
            <span className="material-icons">refresh</span>
            페이지 새로고침
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className={styles.homeButton}
          >
            <span className="material-icons">home</span>
            홈으로 이동
          </button>
        </div>
        {error.code && (
          <div className={styles.errorDetails}>
            <p>에러 코드: {error.code}</p>
            <p>발생 시각: {new Date(error.timestamp || Date.now()).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ErrorPage 