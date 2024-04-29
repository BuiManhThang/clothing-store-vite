import { createBrowserRouter } from 'react-router-dom'
import Root from '../pages/root'
import ErrorPage from '../pages/error-page'
import AdminPage from '../pages/admin/admin-page'
import DashBoardPage from '../pages/admin/dashboard-page'
import UserPage from '../pages/admin/user-page'
import LoginPage from '../pages/login-page'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/admin',
    element: <AdminPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/admin',
        element: <DashBoardPage />,
      },
      {
        path: '/admin/users',
        element: <UserPage />,
      },
    ],
  },
])

export default router
