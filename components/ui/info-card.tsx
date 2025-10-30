import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface InfoCardProps {
  icon?: LucideIcon
  title: string
  description: string
  className?: string
}

export function InfoCard({ icon: Icon, title, description, className }: InfoCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      )}
      <h3 className="mb-2 text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
