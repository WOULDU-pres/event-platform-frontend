import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import HomePage from '../common/pages/HomePage'
import ErrorBoundary from '../common/util/error/ErrorBoundary/ErrorBoundary'
import ErrorPage from '../common/pages/ErrorPage/ErrorPage'
import { RaffleListPage } from '../features/raffle/pages/RaffleListPage/RaffleListPage'
import { RaffleDetailPage } from '../features/raffle/pages/RaffleDetailPage/RaffleDetailPage'
import { RaffleCreatePage } from '../features/raffle/pages/RaffleCreatePage/RaffleCreatePage'
import { RaffleEditPage } from '../features/raffle/pages/RaffleEditPage/RaffleEditPage'
import { RaffleResultPage } from '../features/raffle/pages/RaffleResultPage/RaffleResultPage'

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
  },
  {
    path: '/raffles',
    element: <RaffleListPage />,
  },
  {
    path: '/raffles/create',
    element: <RaffleCreatePage />,
  },
  {
    path: '/raffles/:raffleId',
    element: <RaffleDetailPage />,
  },
  {
    path: '/raffles/:raffleId/edit',
    element: <RaffleEditPage />,
  },
  {
    path: '/raffles/:raffleId/results',
    element: <RaffleResultPage />,
  },
])
