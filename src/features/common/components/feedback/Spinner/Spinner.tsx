import styles from './Spinner.module.css'

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large'
  color?: string
  className?: string
}

export function Spinner({ 
  size = 'medium',
  color = 'currentColor',
  className = ''
}: SpinnerProps) {
  return (
    <div 
      className={`${styles.spinner} ${styles[size]} ${className}`}
      style={{ borderColor: color, borderRightColor: 'transparent' }}
    />
  )
} 