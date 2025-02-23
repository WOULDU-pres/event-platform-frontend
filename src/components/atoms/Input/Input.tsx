import styles from './Input.module.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = ({ label, error, ...props }: InputProps) => {
  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        className={`${styles.input} ${error ? styles.error : ''}`}
        {...props}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  )
}

export default Input
