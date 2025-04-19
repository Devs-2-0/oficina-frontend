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

        </CardContent>
      </Card>
    </div>
  )
}
