import styles from './Button.module.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

const Button = ({ 
  variant = 'primary',
  size = 'md',
  className,
  ...props 
}: ButtonProps) => {
  return (
    <button
      className={`${styles.base} ${styles[variant]} ${styles[size]} ${className}`}
      {...props}
    />
  )
}

export default Button
