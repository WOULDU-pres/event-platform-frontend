import { useState } from 'react'
import styles from './Image.module.css'

interface ImageProps {
  src: string
  alt: string
  fallbackSrc?: string
  width?: number | string
  height?: number | string
  className?: string
  onClick?: () => void
}

export function Image({ 
  src, 
  alt, 
  fallbackSrc = '/placeholder-image.png',
  width,
  height,
  className,
  onClick 
}: ImageProps) {
  const [error, setError] = useState(false)

  const handleError = () => {
    if (!error) {
      setError(true)
    }
  }

  return (
    <img
      src={error ? fallbackSrc : src}
      alt={alt}
      width={width}
      height={height}
      className={`${styles.image} ${className || ''}`}
      onClick={onClick}
      onError={handleError}
    />
  )
} 