import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import { BrowserRouter, RouterProvider } from 'react-router-dom'
import { router, } from './router.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from "@/components/ui/toaster"

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  </QueryClientProvider>
)
