// import Link from "next/link"

// import Container from "@/components/shared/Container"

// export default function Footer() {
//   return (
//     <footer className="bg-slate-950 py-16 text-slate-300">
//       <Container>

//         <div className="grid gap-10 md:grid-cols-4">

//           <div>

//             <h3 className="text-2xl font-bold text-white">
//               NARP
//             </h3>

//             <p className="mt-4 text-slate-400">
//               Connecting customers with trusted Filipino professionals.
//             </p>

//           </div>

//           <div>

//             <h4 className="font-semibold text-white">
//               Company
//             </h4>

//             <div className="mt-4 space-y-3">

//               <Link href="#" className="block hover:text-white">
//                 About
//               </Link>

//               <Link href="#" className="block hover:text-white">
//                 Careers
//               </Link>

//               <Link href="#" className="block hover:text-white">
//                 Blog
//               </Link>

//             </div>

//           </div>

//           <div>

//             <h4 className="font-semibold text-white">
//               Support
//             </h4>

//             <div className="mt-4 space-y-3">

//               <Link href="#" className="block hover:text-white">
//                 Help Center
//               </Link>

//               <Link href="#" className="block hover:text-white">
//                 Contact
//               </Link>

//               <Link href="#" className="block hover:text-white">
//                 Privacy Policy
//               </Link>

//             </div>

//           </div>

//           <div>

//             <h4 className="font-semibold text-white">
//               Download
//             </h4>

//             <p className="mt-4 text-slate-400">
//               Coming soon on Google Play and the App Store.
//             </p>

//           </div>

//         </div>

//         <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
//           © {new Date().getFullYear()} NARP. All rights reserved.
//         </div>

//       </Container>
//     </footer>
//   )
// }


import Image from "next/image";

import Container from "@/components/shared/Container";

import { Mail, MapPin } from "lucide-react";

import {
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaYoutube,
} from "react-icons/fa";

import FooterColumn from "./FooterColumn";
import { footerColumns } from "./footerData";
import SocialIcon from "./SocialIcon";
import { socialLinks } from "./socialLinks";

export default function Footer() {
    return (
        <footer
            className="
                relative
                overflow-hidden
                bg-gradient-to-b
                from-slate-900
                via-slate-950
                to-black
                text-white
            "
        >

            <div className="absolute inset-0 overflow-hidden">

                <div
                    className="
                        absolute
                        -top-32
                        left-1/2
                        h-[500px]
                        w-[500px]
                        -translate-x-1/2
                        rounded-full
                        bg-orange-500/10
                        blur-3xl
                    "
                />

                <div
                    className="
                        absolute
                        bottom-0
                        right-0
                        h-72
                        w-72
                        rounded-full
                        bg-blue-500/10
                        blur-3xl
                    "
                />

            </div>

            <Container className="relative z-10">

                <div className="grid gap-16 py-24 lg:grid-cols-[2fr_3fr]">

                    {/* Left */}

                    <div>

                        <Image
                            src="/logo/logo_smooth.png"
                            alt="NARP"
                            width={240}
                            height={30}
                            className="h-20 w-auto"
                        />

                        <p className="mt-8 max-w-md leading-8 text-slate-400">

                            Connecting customers with trusted freelancers across the 
                            Philippines through AI-powered matching, secure bookings, 
                            and verified professionals.

                        </p>

                        <div className="mt-10 space-y-4">

                            <div className="flex items-center gap-3">

                                <Mail className="h-5 w-5 text-orange-400" />

                                support@narp.app

                            </div>

                            <div className="flex items-center gap-3">

                                <MapPin className="h-5 w-5 text-orange-400" />

                                Philippines

                            </div>

                        </div>

                        <div className="mt-10 flex gap-5">

                            <FaFacebook className="cursor-pointer text-slate-400 transition hover:text-orange-400" />

                            <FaInstagram className="cursor-pointer text-slate-400 transition hover:text-orange-400" />

                            <FaLinkedin className="cursor-pointer text-slate-400 transition hover:text-orange-400" />

                            <FaYoutube className="cursor-pointer text-slate-400 transition hover:text-orange-400" />

                        </div>

                        {/* <div className="mt-10">

                            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">

                                Follow NARP

                            </p>

                        </div>

                        <div className="mt-10 flex flex-wrap gap-4">

                            {socialLinks.map((social) => (

                                <SocialIcon
                                    label={""} key={social.name}
                                    {...social} />

                            ))}

                        </div> */}

                    </div>

                    {/* Right */}

                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

                        {footerColumns.map((column) => (

                            <FooterColumn
                                key={column.title}
                                {...column}
                            />

                        ))}

                        <div>

                            <h3 className="mb-5 text-lg font-bold">

                                Download

                            </h3>

                            <div className="space-y-4">

                                <Image
                                    src="/images/store/google-play.svg"
                                    alt="Google Play"
                                    width={170}
                                    height={55}
                                    className="h-auto w-40"
                                />

                                <Image
                                    src="/images/store/app-store.svg"
                                    alt="App Store"
                                    width={170}
                                    height={55}
                                    className="h-auto w-40"
                                />

                            </div>

                        </div>

                    </div>

                </div>

                <div className="flex flex-col items-center justify-between gap-5 border-t border-slate-800 py-8 text-sm text-slate-500 lg:flex-row">

                    <p>

                        © 2026 NARP. All rights reserved.

                    </p>

                    <p>

                        Made in the Philippines 🇵🇭

                    </p>

                    <div className="flex gap-6">

                        <a href="#">Privacy Policy</a>

                        <a href="#">Terms of Service</a>

                    </div>

                </div>

            </Container>

        </footer>
    );
}