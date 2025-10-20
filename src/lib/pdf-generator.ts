import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Financeiro, RegistroFinanceiro } from '@/types/financeiro'
import { formatCurrency } from './utils'

export interface PDFOptions {
  title?: string
  includeHeader?: boolean
  includeFooter?: boolean
  orientation?: 'portrait' | 'landscape'
  pageSize?: 'a4' | 'a3' | 'letter'
  margin?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }
}

export class FinanceiroPDFGenerator {
  private doc: jsPDF
  private options: PDFOptions

  constructor(options: PDFOptions = {}) {
    this.options = {
      title: 'Demonstrativo de pagamento',
      includeHeader: true,
      includeFooter: true,
      orientation: 'portrait',
      pageSize: 'a4',
      margin: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
      },
      ...options
    }

    this.doc = new jsPDF({
      orientation: this.options.orientation,
      unit: 'mm',
      format: this.options.pageSize
    })
  }

  private addHeader() {
    if (!this.options.includeHeader) return

    // Company logo/header area
    this.doc.setFillColor(220, 53, 69) // Red color matching the theme
    this.doc.rect(0, 0, this.doc.internal.pageSize.width, 25, 'F')
    
    // Company name
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFontSize(18)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('OFICINA', 20, 15)
    
    // Subtitle
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text('Sistema de Gestão', 20, 22)
    
    // Reset text color
    this.doc.setTextColor(0, 0, 0)
  }

  private addFooter() {
    if (!this.options.includeFooter) return

    const pageHeight = this.doc.internal.pageSize.height
    const currentPage = this.doc.getCurrentPageInfo().pageNumber
    const totalPages = this.doc.getNumberOfPages()

    this.doc.setFontSize(10)
    this.doc.setTextColor(128, 128, 128)
    this.doc.text(
      `Página ${currentPage} de ${totalPages}`,
      this.doc.internal.pageSize.width - 30,
      pageHeight - 10
    )
    
    this.doc.text(
      `Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
      20,
      pageHeight - 10
    )
  }

  private addTitle(title: string) {
    this.doc.setFontSize(20)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(51, 51, 51)
    this.doc.text(title, 20, 40)
  }

  private addFinanceiroInfo(financeiro: Financeiro) {
    const startY = 55
    
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(51, 51, 51)
    this.doc.text('Informações do Registro', 20, startY)

    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(102, 102, 102)

    const infoData = [
      ['Prestador:', financeiro.prestador?.nome || '-'],
      ['ID do Prestador:', financeiro.id_prestador.toString()],
      ['Período:', financeiro.periodo || '-'],
      ['Status:', financeiro.baixado ? 'Baixado' : 'Pendente'],
      ['Data de Baixa:', financeiro.baixado_em ? new Date(financeiro.baixado_em as string).toLocaleDateString('pt-BR') : '-'],
      ['Nome do Arquivo:', financeiro.nome_arquivo || '-'],
      ['Total de Registros:', (financeiro.registros_financeiros?.length || 0).toString()]
    ]

    let currentY = startY + 8
    infoData.forEach(([label, value]) => {
      this.doc.text(label, 20, currentY)
      this.doc.text(value, 80, currentY)
      currentY += 5
    })

    return currentY + 10
  }

  private addRegistrosTable(financeiro: Financeiro, startY: number) {
    if (!financeiro.registros_financeiros || financeiro.registros_financeiros.length === 0) {
      this.doc.setTextColor(128, 128, 128)
      this.doc.text('Nenhum registro financeiro encontrado', 20, startY)
      return startY + 10
    }

    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(51, 51, 51)
    this.doc.text('Registros Financeiros', 20, startY)

    const tableData = financeiro.registros_financeiros.map((item: RegistroFinanceiro) => {
      const numericValue = typeof item.valor === 'string' ? Number(item.valor) : item.valor
      const isProvento = item.tipo === '1'
      const isDesconto = item.tipo === '2'
      const isBaseProvento = item.tipo === '3'
      const isBaseDesconto = item.tipo === '4'

      return [
        item.cod_verba,
        item.atividade,
        item.descricao,
        isBaseProvento || isBaseDesconto ? formatCurrency(numericValue) : '-',
        isProvento ? formatCurrency(numericValue) : '-',
        isDesconto ? formatCurrency(numericValue) : '-'
      ]
    })

    const tableHeaders = [
      'Verba',
      'Atividade', 
      'Descrição',
      'Bases',
      'Proventos',
      'Descontos'
    ]

    autoTable(this.doc, {
      head: [tableHeaders],
      body: tableData,
      startY: startY + 5,
      margin: { 
        top: 10,
        bottom: 30, // Increased bottom margin to avoid footer overlap
        left: this.options.margin?.left || 20, 
        right: this.options.margin?.right || 20 
      },
      styles: {
        fontSize: 8,
        cellPadding: 2,
        lineColor: [220, 220, 220],
        lineWidth: 0.1,
        textColor: [51, 51, 51]
      },
      headStyles: {
        fillColor: [220, 53, 69],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      },
      columnStyles: {
        0: { cellWidth: 18 }, // Verba
        1: { cellWidth: 22 }, // Atividade
        2: { cellWidth: 45 }, // Descrição
        3: { cellWidth: 30, halign: 'right' }, // Bases
        4: { cellWidth: 30, halign: 'right' }, // Proventos
        5: { cellWidth: 30, halign: 'right' }  // Descontos
      },
      didDrawPage: (data) => {
        // Add footer to each page as the table is drawn
        this.addFooter()
      },
      willDrawPage: (data) => {
        // Ensure proper spacing for footer
        data.cursor.y = Math.max(data.cursor.y, 20)
      }
    })

    // Get the final Y position after the table
    const finalY = (this.doc as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || startY + 50
    return finalY + 10
  }

  private addSummary(financeiro: Financeiro, startY: number) {
    if (!financeiro.registros_financeiros || financeiro.registros_financeiros.length === 0) {
      return startY
    }

    // Check if there's enough space for the summary
    const pageHeight = this.doc.internal.pageSize.height
    const requiredSpace = 50 // Space needed for summary section
    
    if (startY + requiredSpace > pageHeight - 30) {
      // Add a new page for the summary
      this.doc.addPage()
      this.addHeader() // Add header to new page
      startY = 40 // Reset Y position for new page
    }

    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(51, 51, 51)
    this.doc.text('Resumo Financeiro', 20, startY)

    let totalBases = 0
    let totalProventos = 0
    let totalDescontos = 0

    financeiro.registros_financeiros.forEach((item: RegistroFinanceiro) => {
      const numericValue = typeof item.valor === 'string' ? Number(item.valor) : item.valor
      
      if (item.tipo === '3' || item.tipo === '4') { // Base
        totalBases += numericValue
      } else if (item.tipo === '1') { // Provento
        totalProventos += numericValue
      } else if (item.tipo === '2') { // Desconto
        totalDescontos += numericValue
      }
    })

    const netValue = totalProventos - totalDescontos

    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(102, 102, 102)

    const summaryData = [
      ['Total de Bases:', formatCurrency(totalBases)],
      ['Total de Proventos:', formatCurrency(totalProventos)],
      ['Total de Descontos:', formatCurrency(totalDescontos)],
      ['Valor Líquido:', formatCurrency(netValue)]
    ]

    let currentY = startY + 8
    summaryData.forEach(([label, value]) => {
      this.doc.text(label, 20, currentY)
      this.doc.text(value, 120, currentY)
      currentY += 5
    })
    
    // Add footer to the summary page
    this.addFooter()
    
    return currentY + 5
  }

  generatePDF(financeiro: Financeiro, filename?: string): void {
    try {
      // Add header
      this.addHeader()
      
      // Add title
      this.addTitle(this.options.title || 'Demonstrativo de pagamento')
      
      // Add financeiro information
      let currentY = this.addFinanceiroInfo(financeiro)
      
      // Add registros table (footer is added automatically in didDrawPage)
      currentY = this.addRegistrosTable(financeiro, currentY)
      
      // Add summary
      currentY = this.addSummary(financeiro, currentY)
      
      // Save the PDF
      const finalFilename = filename || `financeiro-${financeiro.id_prestador}-${financeiro.periodo}.pdf`
      this.doc.save(finalFilename)
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      throw new Error('Falha ao gerar PDF. Verifique os dados e tente novamente.')
    }
  }

  generateMultiplePDFs(financeiros: Financeiro[], filename?: string): void {
    try {
      if (financeiros.length === 0) return

      if (financeiros.length === 1) {
        this.generatePDF(financeiros[0], filename)
        return
      }

      // For multiple financeiros, create a detailed table PDF
      this.doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: this.options.pageSize
      })

      this.addHeader()
      this.addTitle('Relatório Completo de Registros Financeiros')

      // Create detailed table with all financial records
      const tableData: (string | number)[][] = []
      
      financeiros.forEach((financeiro) => {
        if (financeiro.registros_financeiros && financeiro.registros_financeiros.length > 0) {
          financeiro.registros_financeiros.forEach((item: RegistroFinanceiro) => {
            const numericValue = typeof item.valor === 'string' ? Number(item.valor) : item.valor
            const isProvento = item.tipo === '1'
            const isDesconto = item.tipo === '2'
            const isBaseProvento = item.tipo === '3'
            const isBaseDesconto = item.tipo === '4'

            tableData.push([
              financeiro.prestador?.nome || '-',
              financeiro.id_prestador.toString(),
              financeiro.periodo || '-',
              item.cod_verba,
              item.atividade,
              item.descricao,
              isBaseProvento || isBaseDesconto ? formatCurrency(numericValue) : '-',
              isProvento ? formatCurrency(numericValue) : '-',
              isDesconto ? formatCurrency(numericValue) : '-',
              financeiro.baixado ? 'Baixado' : 'Pendente',
              financeiro.baixado_em ? new Date(financeiro.baixado_em as string).toLocaleDateString('pt-BR') : '-'
            ])
          })
        } else {
          // If no financial records, add a row with basic info
          tableData.push([
            financeiro.prestador?.nome || '-',
            financeiro.id_prestador.toString(),
            financeiro.periodo || '-',
            '-',
            '-',
            '-',
            '-',
            '-',
            '-',
            financeiro.baixado ? 'Baixado' : 'Pendente',
            financeiro.baixado_em ? new Date(financeiro.baixado_em as string).toLocaleDateString('pt-BR') : '-'
          ])
        }
      })

      const tableHeaders = [
        'Prestador',
        'ID',
        'Período',
        'Verba',
        'Atividade',
        'Descrição',
        'Bases',
        'Proventos',
        'Descontos',
        'Status',
        'Data de Baixa'
      ]

      autoTable(this.doc, {
        head: [tableHeaders],
        body: tableData,
        startY: 40,
        margin: { 
          top: 10,
          bottom: 30, // Increased bottom margin to avoid footer overlap
          left: this.options.margin?.left || 20, 
          right: this.options.margin?.right || 20 
        },
        styles: {
          fontSize: 8,
          cellPadding: 2,
          lineColor: [220, 220, 220],
          lineWidth: 0.1,
          textColor: [51, 51, 51]
        },
        headStyles: {
          fillColor: [220, 53, 69],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250]
        },
        columnStyles: {
          0: { cellWidth: 22 }, // Prestador
          1: { cellWidth: 12 }, // ID
          2: { cellWidth: 18 }, // Período
          3: { cellWidth: 16 }, // Verba
          4: { cellWidth: 18 }, // Atividade
          5: { cellWidth: 30 }, // Descrição
          6: { cellWidth: 25, halign: 'right' }, // Bases
          7: { cellWidth: 25, halign: 'right' }, // Proventos
          8: { cellWidth: 25, halign: 'right' }, // Descontos
          9: { cellWidth: 16 }, // Status
          10: { cellWidth: 18 }  // Data de Baixa
        },
        didDrawPage: (data) => {
          // Add footer to each page as the table is drawn
          this.addFooter()
        },
        willDrawPage: (data) => {
          // Ensure proper spacing for footer
          data.cursor.y = Math.max(data.cursor.y, 20)
        }
      })

      // Add summary section
      const finalY = (this.doc as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 40
      this.addSummarySection(financeiros, finalY + 10)

      // Save the PDF
      const finalFilename = filename || `financeiros-completo-${new Date().toISOString().split('T')[0]}.pdf`
      this.doc.save(finalFilename)
    } catch (error) {
      console.error('Erro ao gerar PDF consolidado:', error)
      throw new Error('Falha ao gerar PDF consolidado. Verifique os dados e tente novamente.')
    }
  }

  private addSummarySection(financeiros: Financeiro[], startY: number): void {
    // Check if there's enough space for the summary section
    const pageHeight = this.doc.internal.pageSize.height
    const requiredSpace = 80 // Space needed for summary section
    
    if (startY + requiredSpace > pageHeight - 30) {
      this.doc.addPage()
      this.addHeader() // Add header to new page
      startY = 40 // Reset Y position for new page
    }

    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(51, 51, 51)
    this.doc.text('Resumo Geral', 20, startY)

    let totalBases = 0
    let totalProventos = 0
    let totalDescontos = 0
    let totalRegistros = 0
    let totalBaixados = 0

    financeiros.forEach((financeiro) => {
      if (financeiro.registros_financeiros) {
        financeiro.registros_financeiros.forEach((item: RegistroFinanceiro) => {
          const numericValue = typeof item.valor === 'string' ? Number(item.valor) : item.valor
          
          if (item.tipo === '3' || item.tipo === '4') { // Base
            totalBases += numericValue
          } else if (item.tipo === '1') { // Provento
            totalProventos += numericValue
          } else if (item.tipo === '2') { // Desconto
            totalDescontos += numericValue
          }
          totalRegistros++
        })
      }
      if (financeiro.baixado) totalBaixados++
    })

    const netValue = totalProventos - totalDescontos

    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(102, 102, 102)

    const summaryData = [
      ['Total de Registros Financeiros:', totalRegistros.toString()],
      ['Total de Prestadores:', financeiros.length.toString()],
      ['Registros Baixados:', totalBaixados.toString()],
      ['Registros Pendentes:', (financeiros.length - totalBaixados).toString()],
      ['Total de Bases:', formatCurrency(totalBases)],
      ['Total de Proventos:', formatCurrency(totalProventos)],
      ['Total de Descontos:', formatCurrency(totalDescontos)],
      ['Valor Líquido Total:', formatCurrency(netValue)]
    ]

    let currentY = startY + 8
    summaryData.forEach(([label, value]) => {
      this.doc.text(label, 20, currentY)
      this.doc.text(value, 120, currentY)
      currentY += 5
    })
    
    // Add footer to the summary page
    this.addFooter()
  }
}

// Utility function to generate PDF for a single financeiro
export const generateFinanceiroPDF = (
  financeiro: Financeiro, 
  options?: PDFOptions, 
  filename?: string
): void => {
  const generator = new FinanceiroPDFGenerator(options)
  generator.generatePDF(financeiro, filename)
}

// Utility function to generate PDF for multiple financeiros
export const generateMultipleFinanceirosPDF = (
  financeiros: Financeiro[], 
  options?: PDFOptions, 
  filename?: string
): void => {
  const generator = new FinanceiroPDFGenerator(options)
  generator.generateMultiplePDFs(financeiros, filename)
}
