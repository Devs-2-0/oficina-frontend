import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './components/theme-provider'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from './contexts/auth-context'
import { worker } from './mocks/browser'

const queryClient = new QueryClient()

// Inicia o service worker do MSW em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  worker.start({
    onUnhandledRequest: 'bypass' // Ignora requisições não mockadas
  })
}

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
)
