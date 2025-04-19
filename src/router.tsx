// routes.tsx
import { createBrowserRouter, RouteObject } from 'react-router-dom'

import Login from './pages/login/Login'
import Feed from './pages/Feed'
import DashboardLayout from './layout/default'
import { Contracts } from './pages/Contracts'
import { Financial } from './pages/Financial'
import { Vacation } from './pages/Vacation'
import { Users } from './pages/users/Users'
import { Providers } from './pages/Providers'
import { ForgotPassword } from './pages/ForgotPassword'
// import { ProtectedRoute } from './components/ProtectedRoute' // ajuste se necessário
// import { ErrorBoundary } from './pages/_layouts/pages/error' // opcional

const publicRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/recuperar-senha',
    element: <ForgotPassword />,
  },
]

const protectedRoutes: RouteObject[] = [
  {
    path: 'feed/*',
    element: <Feed />,
  },
  {
    path: '/contratos',
    element: <Contracts />,
  },
  {
    path: '/financeiro',
    element: <Financial />,
  },
  {
    path: '/ferias',
    element: <Vacation />,
  },
  {
    path: '/usuarios',
    element: <Users />,
  },
  {
    path: '/prestadores',
    element: <Providers />,
  }
]

const layoutRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      // <ProtectedRoute>
      <DashboardLayout />
      // {/* </ProtectedRoute> */}
    ),
    // errorElement: <ErrorBoundary />, // se você quiser
    children: protectedRoutes,
  },
]

const fallbackRoute: RouteObject = {
  path: '*',
  element: <Login />,
}

export const router = createBrowserRouter([
  ...publicRoutes,
  ...layoutRoutes,
  fallbackRoute,
])
