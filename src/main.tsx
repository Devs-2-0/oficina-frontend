import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import { BrowserRouter, RouterProvider } from 'react-router-dom'
import { router, } from './router.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>

)
