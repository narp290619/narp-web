interface MapPinProps {
  top: string
  left: string
  delay?: string
}

export default function MapPin({
  top,
  left,
  delay = "0s",
}: MapPinProps) {
  return (
    <div
      className="absolute"
      style={{
        top,
        left,
        animationDelay: delay,
      }}
    >
      <div className="relative flex items-center justify-center">
        <span className="absolute h-8 w-8 animate-ping rounded-full bg-orange-400 opacity-30" />

        <div className="h-4 w-4 rounded-full border-2 border-white bg-orange-500 shadow-lg" />
      </div>
    </div>
  )
}