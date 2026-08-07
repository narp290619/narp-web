import { ReactNode } from "react";

type LegalLayoutProps = {
    title: string;
    description: string;
    effectiveDate: string;
    lastUpdated?: string;
    icon?: string;
    children: ReactNode;
};

export default function LegalLayout({
    title,
    description,
    effectiveDate,
    lastUpdated,
    icon,
    children,
}: LegalLayoutProps) {

    return (

        <main className="min-h-screen bg-gray-100 py-10">

            <div className="mx-auto max-w-5xl px-5 pt-24">

                {/* Hero */}

                <section className="rounded-3xl bg-gradient-to-br from-blue-600 to-sky-500 p-10 text-center text-white shadow-lg">

                    <div className="text-6xl">
                        {icon}
                    </div>

                    <h1 className="mt-5 text-4xl font-extrabold">
                        {title}
                    </h1>

                    <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-white/90">
                        {description}
                    </p>

                </section>

                {/* Dates */}

                <div className="mt-8 text-center text-gray-500">

                    <p>
                        Effective Date: {effectiveDate}
                    </p>

                    {lastUpdated && (

                        <p className="mt-1">
                            Last Updated: {lastUpdated}
                        </p>

                    )}

                </div>

                {/* Content */}

                <div className="mt-10 space-y-8">

                    {children}

                </div>

                {/* Footer */}

                <footer className="mt-16 border-t pt-8 text-center text-sm text-gray-500">

                    © {new Date().getFullYear()} NARP — Nearby App for Reliable Professionals

                </footer>

            </div>

        </main>

    );

}