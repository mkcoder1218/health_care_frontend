import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export function SectionHeading({ title, subtitle, centered = false, className }: SectionHeadingProps) {
  return (
    <div className={cn("space-y-3", centered && "text-center", className)}>
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground text-balance">{title}</h2>
      {subtitle && <p className="text-lg text-muted-foreground leading-relaxed text-pretty max-w-2xl">{subtitle}</p>}
    </div>
  )
}
