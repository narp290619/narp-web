import Link from "next/link";

interface FooterLink {
    label: string;
    href: string;
}

interface Props {
    title: string;
    links: FooterLink[];
}

export default function FooterColumn({
    title,
    links,
}: Props) {
    return (
        <div>
            <h3
                className="
                    mb-6
                    text-sm
                    font-bold
                    uppercase
                    tracking-[0.25em]
                    text-orange-400
                "
            >
                {title}
            </h3>

            <ul className="space-y-3">

                {links.map((link) => (

                    <li key={link.href}>

                        <Link
                            href={link.href}
                            className="
                                group
                                inline-flex
                                items-center
                                gap-2
                                text-slate-400
                                transition-all
                                duration-300
                                hover:translate-x-1
                                hover:text-white
                            "
                        >
                            {link.label}
                        </Link>

                    </li>

                ))}

            </ul>
        </div>
    );
}