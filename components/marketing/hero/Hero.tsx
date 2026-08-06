import Floating from "@/components/animations/Floating"
import PhoneMockup from "./PhoneMockup"
import ServiceChip from "./ServiceChip"
import Container from "@/components/shared/Container"
import { heroServices } from "./heroServices"
import BackgroundGlow from "@/components/shared/BackgroundGlow"
import GridPattern from "@/components/shared/GridPattern"
import StatCard from "@/components/shared/StatCard"
import PhilippinesMap from "@/components/shared/PhilippinesMap"
import { mapPins } from "./mapPins"
import MapPin from "@/components/shared/MapPin"

export default function Hero() {
    return (
        <section
            id="home"
            className="relative overflow-hidden pt-40 pb-24"
        >

            <BackgroundGlow />
            <GridPattern />

            <div className="absolute inset-0 overflow-hidden -z-10">

                {/* <div className="absolute -left-48 -top-48 h-96 w-96 rounded-full bg-orange-200/40 blur-3xl" />

                <div className="absolute right-0 top-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />

                <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-yellow-200/30 blur-3xl" /> */}

                <div className="absolute -left-48 -top-48 h-96 w-96 animate-pulse rounded-full bg-orange-200/40 blur-3xl" />
                <div className="absolute right-0 top-32 h-96 w-96 animate-pulse rounded-full bg-blue-200/40 blur-3xl [animation-delay:1000ms]" />
                <div className="absolute bottom-0 left-1/3 h-72 w-72 animate-pulse rounded-full bg-yellow-200/30 blur-3xl [animation-delay:2000ms]" />

            </div>

            <div className="container mx-auto grid items-center gap-16 lg:grid-cols-2">

                {/* Left Side */}
                <div>
                    <h1 className="text-5xl font-extrabold leading-tight text-slate-900 lg:text-7xl">

                        The Fastest Way

                        <span className="block text-orange-500">
                            to Find Trusted
                        </span>

                        Professionals <br /> Near You

                    </h1>

                    <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600">

                        <strong>NARP</strong> stands for
                        <span className="font-semibold text-orange-500">
                            {" "}Nearby App for Reliable Professionals
                        </span>.

                        We connect homeowners, businesses, and customers with trusted local professionals—
                        including builders, electricians, plumbers, cleaners, mechanics, tutors, chefs, and many more.

                    </p>

                    {/* <div className="mt-8 flex flex-wrap gap-3">

                        <div className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
                            ✓ Verified Professionals
                        </div>

                        <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
                            ✓ AI Smart Matching
                        </div>

                        <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-600">
                            ✓ Secure Payments
                        </div>

                    </div> */}

                    {/* <div className="mb-10 space-y-3"> */}
                    <div className="mt-8 flex flex-wrap gap-3">

                        <Feature text="AI Smart Matching" />

                        <Feature text="Verified Professionals" />

                        <Feature text="Secure Payments" />

                        <Feature text="Real-Time Tracking" />

                    </div>

                    <div className="mt-10 flex flex-wrap gap-4">

                        <button className="rounded-full bg-orange-500 px-8 py-4 font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-orange-600">
                            Download the App
                        </button>

                        <button className="rounded-full border border-slate-300 bg-white px-8 py-4 font-semibold text-slate-700 transition hover:border-orange-500 hover:text-orange-500">
                            Learn More
                        </button>

                    </div>

                    <div className="mt-14 grid grid-cols-2 gap-5 xl:grid-cols-4">

                        <StatCard
                            icon="👷"
                            value={10000}
                            suffix="+"
                            title="Professionals"
                        />

                        <StatCard
                            icon="🛠️"
                            value={150}
                            suffix="+"
                            title="Skills"
                        />

                        <StatCard
                            icon="⭐"
                            value={4.9}
                            decimals={1}
                            title="Average Rating"
                        />

                        <StatCard
                            icon="📍"
                            value={81}
                            title="Provinces"
                        />

                    </div>
                </div>

                {/* Right Side */}
                <div className="relative flex h-[700px] items-center justify-center">

                    <PhilippinesMap />

                    {mapPins.map((pin) => (
                        <MapPin
                            key={pin.label}
                            {...pin}
                        />
                    ))}

                    <PhoneMockup
                        image="/images/app/welcome.png"
                        rotate="-rotate-12"
                        translate="-translate-x-28"
                        animation="float-slow"
                        delay={0}
                    />

                    <PhoneMockup
                        image="/images/app/home-screen.png"
                        animation="float-medium"
                        delay={0.6}
                    />

                    <PhoneMockup
                        image="/images/app/splash.png"
                        rotate="rotate-12"
                        translate="translate-x-28"
                        animation="float-fast"
                        delay={1.2}
                    />

                    {heroServices.map((service) => (
                        <div
                            key={service.label}
                            className={`absolute hidden lg:block ${service.position}`}
                        >
                            <Floating delay={service.delay}>
                                <ServiceChip
                                    image={service.image}
                                    label={service.label}
                                />
                            </Floating>
                        </div>
                    ))}

                </div>

            </div>
        </section>
    )
}

function Feature({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
                ✓
            </div>

            <span className="font-medium text-slate-700">
                {text}
            </span>

        </div>
    )
}