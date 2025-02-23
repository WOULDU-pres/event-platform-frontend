import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import HomePage from '../pages/HomePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // 최상위 레이아웃 컴포넌트
    children: [
      {
        index: true,
        element: <HomePage />
      }
    ]
  }
])
