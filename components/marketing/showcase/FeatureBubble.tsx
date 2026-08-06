import { LucideIcon } from "lucide-react"

interface Props {
  title: string
  icon: LucideIcon
  className?: string
}

export default function FeatureBubble({
  title,
  icon: Icon,
  className = "",
}: Props) {
  return (
    <div
      className={`
        flex
        items-center
        gap-3
        rounded-full
        border
        border-slate-200
        bg-white/90
        px-5
        py-3
        shadow-xl
        backdrop-blur
        transition
        duration-300
        hover:scale-105
        ${className}
      `}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
        <Icon
          className="h-5 w-5 text-orange-500"
        />
      </div>

      <span className="font-medium text-slate-800">
        {title}
      </span>
    </div>
  )
}