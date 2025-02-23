import { ReactNode } from 'react'
import styles from './Container.module.css'

interface ContainerProps {
  children: ReactNode
  size?: 'small' | 'medium' | 'large' | 'full'
  className?: string
  fluid?: boolean
}

export function Container({ 
  children, 
  size = 'medium',
  className = '',
  fluid = false
}: ContainerProps) {
  return (
    <div className={`
      ${styles.container}
      ${styles[size]}
      ${fluid ? styles.fluid : ''}
      ${className}
    `}>
      {children}
    </div>
  )
} 