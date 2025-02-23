import { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from './Toast.module.css'

type ToastType = 'info' | 'success' | 'warning' | 'error'

interface ToastProps {
  type?: ToastType
  message: ReactNode
  duration?: number
  onClose: () => void
}

export function Toast({
  type = 'info',
  message,
  duration = 3000,
  onClose
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  return createPortal(
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.message}>{message}</div>
      <button onClick={onClose} className={styles.closeButton}>
        ×
      </button>
    </div>,
    document.body
  )
}

interface ToastContainerProps {
  children: ReactNode
}

export function ToastContainer({ children }: ToastContainerProps) {
  return createPortal(
    <div className={styles.container}>{children}</div>,
    document.body
  )
} 