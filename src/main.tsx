import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './components/theme-provider'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from './contexts/auth-context'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} >

        </RouterProvider>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
)
