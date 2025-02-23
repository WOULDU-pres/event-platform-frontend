import { ReactNode } from 'react'
import styles from './Badge.module.css'

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info'
type BadgeSize = 'small' | 'medium' | 'large'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  className?: string
  dot?: boolean
}

export function Badge({ 
  children, 
  variant = 'primary',
  size = 'medium',
  className = '',
  dot = false
}: BadgeProps) {
  return (
    <span className={`
      ${styles.badge} 
      ${styles[variant]} 
      ${styles[size]}
      ${dot ? styles.dot : ''}
      ${className}
    `}>
      {dot && <span className={styles.dotIndicator} />}
      {children}
    </span>
  )
}

export type { BadgeVariant }