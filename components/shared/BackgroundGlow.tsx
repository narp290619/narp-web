export default function BackgroundGlow() {
  return (
    <>
      {/* Orange */}
      <div className="absolute left-1/2 top-24 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-orange-400/20 blur-[140px]" />

      {/* Blue */}
      <div className="absolute right-0 top-52 h-[420px] w-[420px] rounded-full bg-sky-400/15 blur-[140px]" />

      {/* Yellow */}
      <div className="absolute left-0 bottom-0 h-[320px] w-[320px] rounded-full bg-amber-300/20 blur-[120px]" />
    </>
  )
}