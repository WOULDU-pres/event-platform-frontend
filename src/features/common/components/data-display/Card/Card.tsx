import { ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps {
  title?: ReactNode
  subtitle?: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
  hoverable?: boolean
}

export function Card({ 
  title, 
  subtitle, 
  children, 
  footer,
  className = '',
  hoverable = false
}: CardProps) {
  return (
    <div className={`${styles.card} ${hoverable ? styles.hoverable : ''} ${className}`}>
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
      )}
      <div className={styles.content}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  )
} 