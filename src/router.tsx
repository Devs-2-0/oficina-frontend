// routes.tsx
import { createBrowserRouter, RouteObject } from 'react-router-dom'

import Login from './pages/login/Login'
import { Feed } from './pages/feed/Feed'
import DashboardLayout from './layout/default'
import { Contracts } from './pages/contracts/Contracts'

import { Vacation } from './pages/vacation/Vacation'
import { Users } from './pages/users/Users'
import { Providers } from './pages/Providers'
import { ForgotPassword } from './pages/ForgotPassword'
import { Groups } from './pages/groups'
import { Financeiro } from './pages/financeiro/Financeiro'
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
    element: <Financeiro />,
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
  },
  {
    path: '/grupos',
    element: <Groups />,
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
