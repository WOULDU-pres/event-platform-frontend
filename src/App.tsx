import { Outlet } from 'react-router-dom'
import PageTemplate from './components/templates/PageTemplate'

const App = () => {
  return (
    <PageTemplate>
      <Outlet />
    </PageTemplate>
  )
}

export default App
