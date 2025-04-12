import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export const ForgotPassword = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex justify-center mb-2">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-sem-textojfif%201-70bNzb6riBaosJdzTM56a40I1BX1V8.png"
              alt="Logo"
              width={60}
              height={60}
              className="bg-white rounded-md p-1"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Recuperar Senha</CardTitle>
          <CardDescription className="text-primary-foreground/80 text-center">
            Informe seu email para receber instruções
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Digite seu email" required />
            </div>
            <Button type="submit" className="w-full bg-primary">
              Enviar instruções
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          {/* Link de navegação para login */}
          <Button variant="link" asChild>
            <Link to="/login">Voltar para o login</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
};
