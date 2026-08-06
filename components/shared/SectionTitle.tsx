interface SectionTitleProps {
  badge?: string
  title: string
  subtitle: string
}

export default function SectionTitle({
  badge,
  title,
  subtitle,
}: SectionTitleProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">

      {badge && (
        <div className="mb-4 inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
          {badge}
        </div>
      )}

      <h2 className="text-4xl font-bold text-slate-900 lg:text-5xl">
        {title}
      </h2>

      <p className="mt-6 text-lg leading-8 text-slate-600">
        {subtitle}
      </p>

    </div>
  )
}