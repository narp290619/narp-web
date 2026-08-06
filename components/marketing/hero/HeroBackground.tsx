export default function HeroBackground() {
  return (
    <>
      {/* Orange glow */}
      <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-orange-300 opacity-30 blur-3xl" />

      {/* Yellow glow */}
      <div className="absolute bottom-0 left-0 h-[450px] w-[450px] rounded-full bg-yellow-200 opacity-20 blur-3xl" />

      {/* Small floating circles */}
      <div className="absolute top-36 left-24 h-4 w-4 rounded-full bg-orange-400" />
      <div className="absolute top-72 right-56 h-6 w-6 rounded-full bg-orange-200" />
      <div className="absolute bottom-24 left-1/3 h-3 w-3 rounded-full bg-yellow-300" />
    </>
  )
}