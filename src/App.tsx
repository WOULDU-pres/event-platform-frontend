import { Outlet } from 'react-router-dom'
import styles from './App.module.css'

const App = () => {
  return (
    <main className={styles.main}>
      <Outlet />
    </main>
  )
}

export default App
