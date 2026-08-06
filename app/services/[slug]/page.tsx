import Image from "next/image";
import { notFound } from "next/navigation";

import PageContainer from "@/components/shared/PageContainer";
import Container from "@/components/shared/Container";

import {
    Users,
    ShieldCheck,
    Star,
    ArrowRight,
} from "lucide-react";

import { getSkill } from "@/repositories/skill.repository";
import AvailableFreelancers from "@/components/services/detail/AvailableFreelancers";
import { getMembersBySkill } from "@/repositories/skill-member.repository";

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ServiceDetailsPage({
    params,
}: Props) {

    const { slug } = await params;

    const skill = await getSkill(slug);

    if (!skill) {
        notFound();
    }

    const members = await getMembersBySkill(skill.title);

    return (
        <PageContainer>

            {/* Hero */}

            <section className="relative h-[520px] overflow-hidden">

                <Image
                    src={skill.skillSampleImage}
                    alt={skill.title}
                    fill
                    priority
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-black/60" />

                <Container>

                    <div className="relative flex h-[520px] items-end pb-20">

                        <div className="max-w-3xl text-white">

                            <div className="inline-flex rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold">

                                {skill.category}

                            </div>

                            <h1 className="mt-6 text-6xl font-extrabold">

                                Hire Trusted
                                <br />
                                {skill.title} Freelancers

                            </h1>

                            <p className="mt-6 max-w-2xl text-xl text-white/90">

                                Browse verified freelancers,
                                compare ratings,
                                and hire confidently anywhere
                                in the Philippines.

                            </p>

                        </div>

                    </div>

                </Container>

            </section>

            <Container>

                <div className="grid gap-12 py-20 lg:grid-cols-3">

                    {/* LEFT */}

                    <div className="space-y-10 lg:col-span-2">

                        <section>

                            <h2 className="text-3xl font-bold">

                                About this Service

                            </h2>

                            <p className="mt-6 leading-8 text-slate-600">

                                {skill.description ??
                                    `Find experienced ${skill.title.toLowerCase()} freelancers available across the Philippines.
                                    Compare verified freelancers,
                                    view ratings,
                                    and book the right freelancer
                                    for your project with confidence.`}

                            </p>

                        </section>

                        <section>

                            <h2 className="text-3xl font-bold">

                                Why hire through NARP?

                            </h2>

                            <div className="mt-8 grid gap-6 md:grid-cols-2">

                                <FeatureCard
                                    title="Verified Freelancers"
                                    text="Identity verification and profile screening."
                                />

                                <FeatureCard
                                    title="Transparent Ratings"
                                    text="Choose freelancers based on real reviews."
                                />

                                <FeatureCard
                                    title="Secure Payments"
                                    text="Pay safely through the NARP platform."
                                />

                                <FeatureCard
                                    title="AI Matching"
                                    text="NARP AI recommends the best freelancers for your job."
                                />

                            </div>

                        </section>

                        <AvailableFreelancers
                            skill={skill.title}
                            members={members}
                        />

                    </div>

                    {/* RIGHT */}

                    <aside>

                        <div className="sticky top-28 rounded-3xl border bg-white p-8 shadow-xl">

                            <div className="flex items-center gap-4">

                                <Image
                                    src={skill.image}
                                    alt={skill.title}
                                    width={70}
                                    height={70}
                                    className="rounded-2xl"
                                />

                                <div>

                                    <h3 className="text-2xl font-bold">

                                        {skill.title}

                                    </h3>

                                    <p className="text-slate-500">

                                        {skill.category}

                                    </p>

                                </div>

                            </div>

                            <div className="mt-10 space-y-6">

                                <InfoRow
                                    icon={<Users size={20} />}
                                    label="Available Freelancers"
                                    value={skill.totalMembers.toString()}
                                />

                                <InfoRow
                                    icon={<Star size={20} />}
                                    label="Average Rating"
                                    value={
                                        skill.averageRating
                                            ? skill.averageRating.toFixed(1)
                                            : "New"
                                    }
                                />

                                <InfoRow
                                    icon={<ShieldCheck size={20} />}
                                    label="Verification"
                                    value="Verified"
                                />

                            </div>

                            <button
                                className="
                                    mt-10
                                    flex
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-2xl
                                    bg-orange-500
                                    py-4
                                    text-lg
                                    font-bold
                                    text-white
                                    transition
                                    hover:bg-orange-600
                                "
                            >

                                Browse Freelancers

                                <ArrowRight size={20} />

                            </button>

                        </div>

                    </aside>

                </div>

            </Container>

        </PageContainer>
    );
}

function FeatureCard({
    title,
    text,
}: {
    title: string;
    text: string;
}) {
    return (
        <div className="rounded-3xl border p-6">

            <h3 className="text-xl font-bold">

                {title}

            </h3>

            <p className="mt-3 leading-7 text-slate-600">

                {text}

            </p>

        </div>
    );
}

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

                {icon}

                <span>{label}</span>

            </div>

            <span className="font-bold">

                {value}

            </span>

        </div>
    );
}