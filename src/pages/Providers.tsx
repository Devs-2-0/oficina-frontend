import { PageHeader } from "@/components/dashboard/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const Providers = () => {
  return (
    <div className="container py-6 space-y-6">
      <PageHeader title="Prestadores" description="Gerencie prestadores de serviço" />

      <Card>
        <CardHeader>
          <CardTitle>Módulo em Desenvolvimento</CardTitle>
          <CardDescription>Esta seção está em desenvolvimento e terá mais funcionalidades em breve.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>O módulo de prestadores completo incluirá:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Cadastro de prestadores</li>
            <li>Histórico de serviços</li>
            <li>Avaliação de desempenho</li>
            <li>Documentação e certificações</li>
            <li>Relatórios de atividade</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
