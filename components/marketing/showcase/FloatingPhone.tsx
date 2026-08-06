import Image from "next/image"

interface Props {
    image: string
    className?: string
    delay?: string
}

export default function FloatingPhone({
    image,
    className = "",
    delay = "0s",
}: Props) {
    return (
        <div
            className={`
    animate-float
    rounded-[42px]
    bg-black
    p-3
    shadow-2xl
    ${className}
  `}
            style={{
                animationDelay: delay,
            }}
        >
            <div className="overflow-hidden rounded-[34px]">
                <Image
                    src={image}
                    alt="NARP"
                    width={260}
                    height={560}
                    className="h-auto w-auto"
                />
            </div>
        </div>
    )
}