import { ReactNode } from 'react'
import styles from './Alert.module.css'

type AlertType = 'info' | 'success' | 'warning' | 'error'

interface AlertProps {
  type?: AlertType
  title?: string
  children: ReactNode
  onClose?: () => void
  className?: string
}

export function Alert({
  type = 'info',
  title,
  children,
  onClose,
  className = ''
}: AlertProps) {
  return (
    <div className={`${styles.alert} ${styles[type]} ${className}`}>
      <div className={styles.content}>
        {title && <h4 className={styles.title}>{title}</h4>}
        <div className={styles.message}>{children}</div>
      </div>
      {onClose && (
        <button onClick={onClose} className={styles.closeButton}>
          ×
        </button>
      )}
    </div>
  )
} 