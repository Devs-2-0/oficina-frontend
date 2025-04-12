import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  name: string
  className?: string
  compact?: boolean
}

export function UserAvatar({ name, className, compact = false }: UserAvatarProps) {
  // Get initials from name (first and last name)
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  if (compact) {
    return (
      <Avatar className={cn("border border-primary-foreground/10", className)}>
        <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground">{initials}</AvatarFallback>
      </Avatar>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Avatar className="border border-primary-foreground/10">
        <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground">{initials}</AvatarFallback>
      </Avatar>
      <div className="text-sm font-medium text-primary-foreground">{name}</div>
    </div>
  )
}
