import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import HomePage from '../pages/HomePage'
import ErrorBoundary from '../features/common/components/ErrorBoundary/ErrorBoundary'
import ErrorPage from '../pages/ErrorPage/ErrorPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: '*',
        element: <ErrorPage />
      }
    ]
  }
])
