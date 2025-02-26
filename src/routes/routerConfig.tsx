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
import { AttendanceListPage } from '../features/attendance-check/pages/AttendanceListPage/AttendanceListPage'
import { AttendanceDetailPage } from '../features/attendance-check/pages/AttendanceDetailPage/AttendanceDetailPage'
import { AttendanceCreatePage } from '../features/attendance-check/pages/AttendanceCreatePage/AttendanceCreatePage'
import { AttendanceEditPage } from '../features/attendance-check/pages/AttendanceEditPage/AttendanceEditPage'
import { AttendanceScanPage } from '../features/attendance-check/pages/AttendanceScanPage/AttendanceScanPage'
import { AttendanceStatisticsPage } from '../features/attendance-check/pages/AttendanceStatisticsPage/AttendanceStatisticsPage'
import { PickerListPage } from '../features/random-picker/pages/PickerListPage/PickerListPage'
import { PickerDetailPage } from '../features/random-picker/pages/PickerDetailPage/PickerDetailPage'
import { PickerEditPage } from '../features/random-picker/pages/PickerEditPage/PickerEditPage'
import { PickerCreatePage } from '../features/random-picker/pages/PickerCreatePage/PickerCreatePage'

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
  {
    path: '/attendance',
    element: <AttendanceListPage />,
  },
  {
    path: '/attendance/create',
    element: <AttendanceCreatePage />,
  },
  {
    path: '/attendance/:eventId',
    element: <AttendanceDetailPage />,
  },
  {
    path: '/attendance/:eventId/edit',
    element: <AttendanceEditPage />,
  },
  {
    path: '/attendance/:eventId/scan',
    element: <AttendanceScanPage />,
  },
  {
    path: '/attendance/:eventId/statistics',
    element: <AttendanceStatisticsPage />,
  },
  {
    path: '/random-picker',
    element: <PickerListPage />,
  },
  {
    path: '/random-picker/:pickerId',
    element: <PickerDetailPage />,
  },
  {
    path: '/random-picker/:pickerId/edit',
    element: <PickerEditPage />,
  },
  {
    path: '/random-picker/create',
    element: <PickerCreatePage />,
  },
])
