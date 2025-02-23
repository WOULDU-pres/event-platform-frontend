import { FormHTMLAttributes, ReactNode } from 'react'
import styles from './Form.module.css'

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function Form({ children, className = '', onSubmit, ...props }: FormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(e)
  }

  return (
    <form
      className={`${styles.form} ${className}`}
      onSubmit={handleSubmit}
      {...props}
    >
      {children}
    </form>
  )
}

interface FormItemProps {
  children: ReactNode
  label?: string
  error?: string
  required?: boolean
}

export function FormItem({ children, label, error, required }: FormItemProps) {
  return (
    <div className={styles.formItem}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      {children}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
} 