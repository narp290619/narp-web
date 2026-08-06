interface Props {
  number: string
  title: string
  description: string
}

export default function StepCard({
  number,
  title,
  description,
}: Props) {
  return (
    <div
      className="
        relative
        rounded-3xl
        bg-white
        p-10
        shadow-sm
        transition
        duration-300
        hover:-translate-y-2
        hover:shadow-xl
      "
    >
      <span
        className="
          text-7xl
          font-black
          text-orange-100
        "
      >
        {number}
      </span>

      <h3 className="mt-6 text-2xl font-bold">
        {title}
      </h3>

      <p className="mt-4 leading-7 text-slate-600">
        {description}
      </p>
    </div>
  )
}