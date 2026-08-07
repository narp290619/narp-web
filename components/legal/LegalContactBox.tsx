import Link from "next/link";

type LegalContactBoxProps = {
    title?: string;
    email: string;
    website?: string;
    contactHref?: string;
    responseTime?: string;
};

export default function LegalContactBox({
    title = "Need Help?",
    email,
    website = "https://www.narp-svc.site",
    contactHref = "/contact",
    responseTime = "We typically respond within 1–2 business days.",
}: LegalContactBoxProps) {

    return (

        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">

            <h3 className="text-2xl font-bold text-blue-800">

                {title}

            </h3>

            <p className="mt-3 leading-7 text-gray-700">

                If you have any questions regarding this policy,
                our support team is happy to assist you.

            </p>

            {/* Contact Information */}

            <div className="mt-8 space-y-5">

                <div className="flex items-start gap-3">

                    <span className="text-2xl">
                        📧
                    </span>

                    <div>

                        <p className="font-semibold">
                            Email
                        </p>

                        <a
                            href={`mailto:${email}`}
                            className="text-blue-700 hover:underline"
                        >
                            {email}
                        </a>

                    </div>

                </div>

                <div className="flex items-start gap-3">

                    <span className="text-2xl">
                        🌐
                    </span>

                    <div>

                        <p className="font-semibold">
                            Website
                        </p>

                        <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:underline"
                        >
                            {website.replace(/^https?:\/\//, "")}
                        </a>

                    </div>

                </div>

                <div className="flex items-start gap-3">

                    <span className="text-2xl">
                        🕒
                    </span>

                    <div>

                        <p className="font-semibold">
                            Response Time
                        </p>

                        <p className="text-gray-700">
                            {responseTime}
                        </p>

                    </div>

                </div>

            </div>

            {/* Divider */}

            <div className="my-8 border-t border-blue-200" />

            {/* Call to Action */}

            <div className="text-center">

                <h4 className="text-lg font-semibold text-gray-900">

                    Can't find what you're looking for?

                </h4>

                <p className="mx-auto mt-3 max-w-2xl leading-7 text-gray-600">

                    Visit our Contact page and send us a message.
                    We'll be happy to answer your questions,
                    clarify our policies, or assist you with your account.

                </p>

                <Link
                    href={contactHref}
                    className="
                        mt-6
                        inline-flex
                        items-center
                        rounded-full
                        bg-blue-600
                        px-8
                        py-3
                        font-semibold
                        text-white
                        transition
                        hover:bg-blue-700
                    "
                >

                    Contact NARP

                </Link>

            </div>

        </div>

    );

}