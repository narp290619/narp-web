import Image from "next/image"
import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/images/logo/narp.png"
        alt="NARP"
        width={52}
        height={52}
        className="h-auto w-auto"
        priority
      />

      <div className="leading-tight">
        {/* <h1 className="text-xl font-bold tracking-tight text-[#081A43]">
          NARP
        </h1> */}
        <Image
          src="/logo/logo_smooth.png"
          alt="NARP"
          width={92}
          height={92}
          className="h-auto w-auto"
          priority
        />

        <p className="hidden text-xs text-slate-500 lg:block">
          Nearby App for Reliable Professionals
        </p>
      </div>
    </Link>
  )
}