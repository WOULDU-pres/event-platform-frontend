import styles from './PageTemplate.module.css'

interface PageTemplateProps {
  children: React.ReactNode
}

const PageTemplate = ({ children }: PageTemplateProps) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          {/* 헤더 내용 */}
        </nav>
      </header>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}

export default PageTemplate
