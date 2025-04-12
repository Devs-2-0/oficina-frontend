import LoginForm from "@/components/login-form"
import { ThemeToggle } from "@/components/theme-toggle"

const Login = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <LoginForm />
    </main>
  )
}

export default Login