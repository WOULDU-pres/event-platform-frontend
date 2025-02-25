import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import { Layout, Typography } from 'antd'

const { Header: AntHeader } = Layout
const { Title } = Typography

interface HeaderProps {
  title?: string
}

export function Header({ title = '럭키드로우' }: HeaderProps) {
  return (
    <AntHeader className={styles.header}>
      <div className={styles.logo}>
        <Link to="/raffles">
          <Title level={3} className={styles.title}>{title}</Title>
        </Link>
      </div>
    </AntHeader>
  )
} 