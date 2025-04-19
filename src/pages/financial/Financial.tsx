import { PageHeader } from "@/components/dashboard/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const Financial = () => {
  return (
    <div className="container py-6 space-y-6">
      <PageHeader title="Financeiro" description="Gerencie informações financeiras" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pagamentos Pendentes</CardTitle>
            <CardDescription>Pagamentos aguardando processamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 12.450,00</div>
            <p className="text-xs text-muted-foreground">+5% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pagamentos Realizados</CardTitle>
            <CardDescription>Total pago este mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.780,00</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Previsão Mensal</CardTitle>
            <CardDescription>Previsão para o próximo mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 58.230,00</div>
            <p className="text-xs text-muted-foreground">+8% em relação ao mês atual</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Módulo em Desenvolvimento</CardTitle>
          <CardDescription>Esta seção está em desenvolvimento e terá mais funcionalidades em breve.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>O módulo financeiro completo incluirá:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Relatórios financeiros detalhados</li>
            <li>Histórico de pagamentos</li>
            <li>Emissão de notas fiscais</li>
            <li>Controle de impostos</li>
            <li>Previsão orçamentária</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
