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
  const { data: prestadores, isLoading, error } = useGetPrestadores()

  const handleSearch = (search: string) => {
    setSearchValue(search)
  }

  // Filtrar prestadores baseado na busca
  const filteredPrestadores = (prestadores || []).filter(prestador =>
    prestador.nome.toLowerCase().includes(searchValue.toLowerCase()) ||
    prestador.matricula.toLowerCase().includes(searchValue.toLowerCase()) ||
    prestador.email.toLowerCase().includes(searchValue.toLowerCase()) ||
    prestador.identificacao.toLowerCase().includes(searchValue.toLowerCase())
  )

  const selectedPrestador = (prestadores || []).find(prestador => String(prestador.id) === value)

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
                  {selectedPrestador.matricula} • {selectedPrestador.email}
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
              placeholder="Buscar prestador..."
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
                  Carregando prestadores...
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-6 text-red-500">
                  Erro ao carregar prestadores
                </div>
              ) : (
                "Nenhum prestador encontrado."
              )}
            </CommandEmpty>
                         <CommandGroup>
               {filteredPrestadores.length === 0 ? (
                 <div className="p-2 text-sm text-muted-foreground">
                   Nenhum prestador encontrado na busca
                 </div>
               ) : (
                 filteredPrestadores.map((prestador) => (
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
                         {prestador.matricula} • {prestador.email}
                       </span>
                     </div>
                   </CommandItem>
                 ))
               )}
             </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
