import styles from './Header.module.css'
import useCommonStore from '../../../stores/commonStore'

const Header = () => {
  const memberId = useCommonStore((state) => state.memberId)

  return (
    <header className={styles.header}>
      <div className={styles.logo}>Event Platform</div>
      <div className={styles.memberInfo}>
        {memberId && `회원 ID: ${memberId.slice(0, 8)}...`}
      </div>
    </header>
  )
}

export default Header
