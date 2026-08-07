import Link from "next/link";
import {
    Mail,
    MessageCircle,
    Scale,
    ArrowRight,
} from "lucide-react";

export default function ContactSupportCard() {
    return (
        <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-black px-8 py-14 text-white shadow-xl">

            <div className="mx-auto max-w-5xl">

                <div className="text-center">

                    <div className="mb-5 text-5xl">
                        💬
                    </div>

                    <h2 className="text-4xl font-bold">
                        Still Need Help?
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                        Can't find the answer you're looking for?
                        Our support team is here to help with your
                        bookings, payments, account, and technical questions.
                    </p>

                </div>

                <div className="mt-12 grid gap-6 md:grid-cols-3">

                    {/* Email */}

                    <a
                        href="mailto:support@narp-svc.site"
                        className="
                            group
                            rounded-2xl
                            bg-white/5
                            p-6
                            transition
                            hover:bg-white/10
                        "
                    >

                        <Mail className="h-10 w-10 text-orange-400" />

                        <h3 className="mt-5 text-xl font-bold">
                            Email Support
                        </h3>

                        <p className="mt-3 leading-7 text-slate-300">
                            support@narp-svc.site
                        </p>

                        <div className="mt-6 flex items-center gap-2 font-semibold text-orange-400 group-hover:gap-3 transition-all">
                            Send Email
                            <ArrowRight className="h-4 w-4" />
                        </div>

                    </a>

                    {/* Contact Page */}

                    <Link
                        href="/contact"
                        className="
                            group
                            rounded-2xl
                            bg-white/5
                            p-6
                            transition
                            hover:bg-white/10
                        "
                    >

                        <MessageCircle className="h-10 w-10 text-sky-400" />

                        <h3 className="mt-5 text-xl font-bold">
                            Contact Us
                        </h3>

                        <p className="mt-3 leading-7 text-slate-300">
                            Send us a message using our contact form and
                            we'll respond as soon as possible.
                        </p>

                        <div className="mt-6 flex items-center gap-2 font-semibold text-sky-400 group-hover:gap-3 transition-all">
                            Visit Contact Page
                            <ArrowRight className="h-4 w-4" />
                        </div>

                    </Link>

                    {/* Legal Center */}

                    <Link
                        href="/legal"
                        className="
                            group
                            rounded-2xl
                            bg-white/5
                            p-6
                            transition
                            hover:bg-white/10
                        "
                    >

                        <Scale className="h-10 w-10 text-green-400" />

                        <h3 className="mt-5 text-xl font-bold">
                            Legal Center
                        </h3>

                        <p className="mt-3 leading-7 text-slate-300">
                            Review our policies, Terms of Service,
                            Privacy Policy, and other legal documents.
                        </p>

                        <div className="mt-6 flex items-center gap-2 font-semibold text-green-400 group-hover:gap-3 transition-all">
                            Browse Policies
                            <ArrowRight className="h-4 w-4" />
                        </div>

                    </Link>

                </div>

                <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">

                    <p className="text-slate-300">
                        <span className="font-semibold text-white">
                            Response Time:
                        </span>{" "}
                        We typically respond to support inquiries within
                        <span className="font-semibold text-orange-400">
                            {" "}1–2 business days.
                        </span>
                    </p>

                </div>

            </div>

        </section>
    );
}