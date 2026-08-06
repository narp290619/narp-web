export default function GridPattern() {
  return (
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage: `
          linear-gradient(to right,#64748b 1px,transparent 1px),
          linear-gradient(to bottom,#64748b 1px,transparent 1px)
        `,
        backgroundSize: "48px 48px",
      }}
    />
  )
}