import { PageHeader } from "@/components/dashboard/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const Vacation = () => {
  return (
    <div className="container py-6 space-y-6">
      <PageHeader title="Férias" description="Gerencie períodos de férias" />

      <Card>
        <CardHeader>
          <CardTitle>Módulo em Desenvolvimento</CardTitle>
          <CardDescription>Esta seção está em desenvolvimento e terá mais funcionalidades em breve.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>O módulo de férias completo incluirá:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Solicitação de férias</li>
            <li>Aprovação de períodos</li>
            <li>Calendário de férias da equipe</li>
            <li>Histórico de períodos anteriores</li>
            <li>Cálculo de benefícios e adicionais</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
