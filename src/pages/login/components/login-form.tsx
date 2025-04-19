import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePostLoginMutation } from "../hooks/use-post-login"

export default function LoginForm() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const login = usePostLoginMutation()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await login.mutateAsync({
      nomeDeUsuario: formData.username,
      senha: formData.password,
    })


  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1 bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex justify-center mb-3">
          <div className="h-16 w-16 rounded-md bg-white flex items-center justify-center overflow-hidden p-2">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-sem-textojfif%201-70bNzb6riBaosJdzTM56a40I1BX1V8.png"
              alt="Logo"
              width={60}
              height={60}
            />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">Portal de Prestadores</CardTitle>
        <CardDescription className="text-primary-foreground/80 text-center">
          Acesse sua conta para continuar
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuário</Label>
            <Input
              id="username"
              name="username"
              placeholder="Digite seu usuário"
              required
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Button
                variant="link"
                className="px-0 text-sm font-medium text-primary"
                onClick={() => navigate("/recuperar-senha")}
                type="button"
              >
                Esqueci minha senha
              </Button>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                required
                value={formData.password}
                onChange={handleChange}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{showPassword ? "Esconder senha" : "Mostrar senha"}</span>
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full bg-primary" disabled={login.isPending}>
            {login.isPending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
