import { useState } from "react"
import { Check, ChevronsUpDown, Search, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { useGetPrestadores } from "../hooks/use-get-prestadores"
import { useDebounce } from "@/hooks/use-debounce"

interface PrestadorSelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function PrestadorSelect({ 
  value, 
  onValueChange, 
  placeholder = "Selecione um prestador",
  disabled = false 
}: PrestadorSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  
  // Debounce da busca para evitar muitas requisições
  const debouncedSearch = useDebounce(searchValue, 300)
  
  // Buscar prestadores com o termo de busca
  const { data: prestadoresResponse, isLoading, error } = useGetPrestadores({
    search: debouncedSearch.trim() || undefined
  })

  // Extrair prestadores - versão simplificada
  const prestadores = prestadoresResponse?.data || []
  const totalCount = prestadoresResponse?.count || 0

  // Debug logs
  console.log('=== DEBUG PRESTADOR SELECT ===')
  console.log('searchValue:', searchValue)
  console.log('debouncedSearch:', debouncedSearch)
  console.log('prestadoresResponse:', prestadoresResponse)
  console.log('prestadoresResponse type:', typeof prestadoresResponse)
  console.log('prestadoresResponse.data:', prestadoresResponse?.data)
  console.log('prestadoresResponse.data type:', typeof prestadoresResponse?.data)
  console.log('prestadoresResponse.data isArray:', Array.isArray(prestadoresResponse?.data))
  console.log('prestadoresResponse keys:', prestadoresResponse ? Object.keys(prestadoresResponse) : 'null')
  console.log('prestadores (extraídos):', prestadores)
  console.log('prestadores type:', typeof prestadores)
  console.log('prestadores isArray:', Array.isArray(prestadores))
  console.log('prestadores.length:', prestadores.length)
  console.log('totalCount (extraído):', totalCount)
  console.log('isLoading:', isLoading)
  console.log('error:', error)
  console.log('================================')

  const handleSearch = (search: string) => {
    setSearchValue(search)
  }

  const selectedPrestador = prestadores.find(prestador => String(prestador.id) === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled || isLoading}
        >
                     {isLoading ? (
             <div className="flex items-center">
               <Loader2 className="h-4 w-4 animate-spin mr-2" />
               Carregando prestadores...
             </div>
                       ) : selectedPrestador ? (
              <div className="flex flex-col items-start">
                <span className="font-medium">{selectedPrestador.nome}</span>
                <span className="text-xs text-muted-foreground">
                  {selectedPrestador.matricula} • {selectedPrestador.identificacao}
                </span>
              </div>
           ) : (
             placeholder
           )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Digite para buscar prestadores..."
              value={searchValue}
              onValueChange={handleSearch}
              className="border-0 focus:ring-0"
            />
          </div>
          <CommandList>
            <CommandEmpty>
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {searchValue ? "Buscando prestadores..." : "Carregando prestadores..."}
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-6 text-red-500">
                  Erro ao carregar prestadores
                </div>
              ) : (
                searchValue ? "Nenhum prestador encontrado para esta busca." : "Nenhum prestador encontrado."
              )}
            </CommandEmpty>
                         <CommandGroup>
               {/* Debug info */}
               <div className="p-2 text-xs text-blue-600 border-b bg-blue-50">
                 Debug: {prestadores.data.length} prestadores extraídos, count: {totalCount}, loading: {isLoading ? 'sim' : 'não'}
                 <br />
                 Tipo: {typeof prestadores}, isArray: {Array.isArray(prestadores) ? 'sim' : 'não'}
               </div>
               
               {prestadores.length === 0 ? (
                 <div className="p-2 text-sm text-muted-foreground">
                   Nenhum prestador encontrado na busca
                 </div>
               ) : (
                 <>
                   {searchValue && (
                     <div className="p-2 text-xs text-muted-foreground border-b">
                       {totalCount} prestador{totalCount !== 1 ? 'es' : ''} encontrado{totalCount !== 1 ? 's' : ''}
                     </div>
                   )}
                   {prestadores.map((prestador) => (
                     <CommandItem
                       key={prestador.id}
                       value={String(prestador.id)}
                       onSelect={(currentValue) => {
                         onValueChange(currentValue === value ? "" : currentValue)
                         setOpen(false)
                       }}
                     >
                       <Check
                         className={cn(
                           "mr-2 h-4 w-4",
                           value === String(prestador.id) ? "opacity-100" : "opacity-0"
                         )}
                       />
                       <div className="flex flex-col">
                         <span className="font-medium">{prestador.nome}</span>
                         <span className="text-xs text-muted-foreground">
                           {prestador.matricula} • {prestador.identificacao}
                         </span>
                         <span className="text-xs text-muted-foreground">
                           {prestador.cidade}, {prestador.uf} • {prestador.grupo?.nome}
                         </span>
                       </div>
                     </CommandItem>
                   ))}
                 </>
               )}
             </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
