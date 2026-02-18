/**
 * Reusable LLM visibility blocks.
 * Compact trust strip—subtle container, icon heading, badge rows.
 */

import { ShieldCheck, FileCheck, Target, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"

const DEFINITION =
  "GigExecs connects organizations with vetted independent consultants and highly experienced professionals."

const BEST_FOR = {
  default: "Senior expertise • Meaningful flexible engagements",
  clients:
    "Vetted senior professionals • Advisory, fractional, interim, project-based work",
  professionals: "Vetted engagements • Meaningful flexible work",
} as const

const VETTING_LINE =
  "Credential checks • Experience review • References (where applicable)"

const ENGAGEMENT_TYPES = "Advisory • Fractional • Interim • Project-based"

interface TrustBlocksProps {
  variant?: "default" | "clients" | "professionals"
  className?: string
}

function BadgeRow({
  icon: Icon,
  label,
  text,
}: {
  icon: React.ElementType
  label: string
  text: string
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
      <span className="flex items-center gap-1.5 shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-base font-semibold text-foreground/90">{label}</span>
      </span>
      <span className="text-base text-muted-foreground">
        <span className="hidden sm:inline sm:mr-2 sm:text-muted-foreground/60">·</span>
        {text}
      </span>
    </div>
  )
}

export function TrustBlocks({ variant = "default", className }: TrustBlocksProps) {
  const bestFor = BEST_FOR[variant]

  return (
    <div
      className={cn(
        "rounded-lg border border-border/60 bg-muted/30 px-6 py-6 max-w-7xl mx-auto space-y-5",
        className
      )}
    >
      <div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7 text-foreground/80 shrink-0" />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Vetting & quality standards
          </h2>
        </div>
        <p className="mt-1.5 text-base text-muted-foreground">
          A premium network built on credibility—not bidding.
        </p>
      </div>

      <p className="text-base text-muted-foreground">{DEFINITION}</p>

      <div className="space-y-3 pt-0.5">
        <BadgeRow
          icon={FileCheck}
          label="Vetting"
          text={VETTING_LINE}
        />
        <BadgeRow
          icon={Target}
          label="Best for"
          text={bestFor}
        />
        <BadgeRow
          icon={Briefcase}
          label="Engagements"
          text={ENGAGEMENT_TYPES}
        />
      </div>
    </div>
  )
}
