import { ReactNode } from 'react'
import styles from './Grid.module.css'

interface GridProps {
  children: ReactNode
  columns?: number
  gap?: number
  rowGap?: number
  columnGap?: number
  className?: string
}

export function Grid({ 
  children, 
  columns = 12,
  gap,
  rowGap,
  columnGap,
  className = ''
}: GridProps) {
  const style = {
    '--grid-columns': columns,
    '--grid-gap': gap && `${gap}px`,
    '--grid-row-gap': rowGap && `${rowGap}px`,
    '--grid-column-gap': columnGap && `${columnGap}px`,
  } as React.CSSProperties

  return (
    <div className={`${styles.grid} ${className}`} style={style}>
      {children}
    </div>
  )
}

interface GridItemProps {
  children: ReactNode
  span?: number
  offset?: number
  className?: string
}

export function GridItem({ 
  children, 
  span = 1,
  offset,
  className = ''
}: GridItemProps) {
  const style = {
    '--grid-column-span': span,
    '--grid-column-offset': offset && `${offset}`,
  } as React.CSSProperties

  return (
    <div className={`${styles.gridItem} ${className}`} style={style}>
      {children}
    </div>
  )
} 