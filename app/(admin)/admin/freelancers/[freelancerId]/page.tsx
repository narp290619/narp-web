// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useParams } from "next/navigation";

// import {
//     ArrowLeft,
//     BadgeCheck,
//     BriefcaseBusiness,
//     CalendarDays,
//     CheckCircle2,
//     Clock,
//     DollarSign,
//     MapPin,
//     Medal,
//     Star,
//     TrendingUp,
//     User,
//     Users,
//     ShieldCheck,
//     FileText,
// } from "lucide-react";

// import {
//     doc,
//     getDoc,
// } from "firebase/firestore";

// import { db } from "@/lib/firebase";

// type FreelancerRecord = {
//     id: string;

//     userId?: string;

//     skillId?: string;

//     firstName?: string;
//     lastName?: string;

//     profileImageUrl?: string;
//     skillSamplePhotoUrl?: string;

//     aboutMemberSkill?: string;

//     isVerified?: boolean;

//     startingPrice?: number;

//     rating?: number;
//     rating3?: number;
//     ratingTotal?: number;
//     reviewCount?: number;

//     completedJobs?: number;

//     rankingScore?: number;
//     popularityScore?: number;

//     latitude?: number;
//     longitude?: number;

//     createdAt?: Date | null;
//     updatedLocationAt?: Date | null;
// };

// function getDate(value: unknown): Date | null {
//     if (
//         value &&
//         typeof value === "object" &&
//         "toDate" in value &&
//         typeof (
//             value as {
//                 toDate: () => Date;
//             }
//         ).toDate === "function"
//     ) {
//         return (
//             value as {
//                 toDate: () => Date;
//             }
//         ).toDate();
//     }

//     if (value instanceof Date) {
//         return value;
//     }

//     return null;
// }

// function getFreelancerName(
//     freelancer: FreelancerRecord
// ) {
//     const name = [
//         freelancer.firstName,
//         freelancer.lastName,
//     ]
//         .filter(Boolean)
//         .join(" ")
//         .trim();

//     return name || "Unnamed Freelancer";
// }

// function formatDate(date: Date | null) {
//     if (!date) {
//         return "—";
//     }

//     return date.toLocaleDateString("en-PH", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//     });
// }

// function formatDateTime(date: Date | null) {
//     if (!date) {
//         return "—";
//     }

//     return date.toLocaleString("en-PH", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//         hour: "numeric",
//         minute: "2-digit",
//     });
// }

// function formatCurrency(
//     value?: number
// ) {
//     if (
//         value === undefined ||
//         Number.isNaN(value)
//     ) {
//         return "—";
//     }

//     return new Intl.NumberFormat(
//         "en-PH",
//         {
//             style: "currency",
//             currency: "PHP",
//             maximumFractionDigits: 0,
//         }
//     ).format(value);
// }

// function formatRating(
//     value?: number
// ) {
//     if (
//         value === undefined ||
//         Number.isNaN(value)
//     ) {
//         return "—";
//     }

//     return value.toFixed(1);
// }

// function StatCard({
//     icon: Icon,
//     label,
//     value,
//     description,
// }: {
//     icon: typeof Star;
//     label: string;
//     value: string;
//     description?: string;
// }) {
//     return (
//         <div
//             className="
//                 rounded-2xl
//                 border
//                 border-slate-200
//                 bg-white
//                 p-5
//                 shadow-sm
//             "
//         >
//             <div className="flex items-start justify-between gap-4">

//                 <div>

//                     <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
//                         {label}
//                     </p>

//                     <p className="mt-2 text-2xl font-bold text-slate-900">
//                         {value}
//                     </p>

//                     {description && (
//                         <p className="mt-1 text-xs text-slate-400">
//                             {description}
//                         </p>
//                     )}

//                 </div>

//                 <div
//                     className="
//                         flex
//                         h-10
//                         w-10
//                         flex-shrink-0
//                         items-center
//                         justify-center
//                         rounded-xl
//                         bg-blue-50
//                     "
//                 >
//                     <Icon className="h-5 w-5 text-blue-600" />
//                 </div>

//             </div>
//         </div>
//     );
// }

// function InfoItem({
//     icon: Icon,
//     label,
//     value,
// }: {
//     icon: typeof User;
//     label: string;
//     value: string;
// }) {
//     return (
//         <div className="flex items-start gap-3">

//             <div
//                 className="
//                     mt-0.5
//                     flex
//                     h-9
//                     w-9
//                     flex-shrink-0
//                     items-center
//                     justify-center
//                     rounded-lg
//                     bg-slate-100
//                 "
//             >
//                 <Icon className="h-4 w-4 text-slate-500" />
//             </div>

//             <div className="min-w-0">

//                 <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                     {label}
//                 </p>

//                 <p className="mt-1 break-words text-sm font-medium text-slate-800">
//                     {value}
//                 </p>

//             </div>

//         </div>
//     );
// }

// function VerificationBadge({
//     verified,
// }: {
//     verified?: boolean;
// }) {
//     if (verified) {
//         return (
//             <span
//                 className="
//                     inline-flex
//                     items-center
//                     gap-2
//                     rounded-full
//                     bg-green-50
//                     px-3
//                     py-1.5
//                     text-sm
//                     font-semibold
//                     text-green-700
//                 "
//             >
//                 <BadgeCheck className="h-4 w-4" />
//                 Verified Freelancer
//             </span>
//         );
//     }

//     return (
//         <span
//             className="
//                 inline-flex
//                 items-center
//                 gap-2
//                 rounded-full
//                 bg-orange-50
//                 px-3
//                 py-1.5
//                 text-sm
//                 font-semibold
//                 text-orange-700
//             "
//         >
//             <Clock className="h-4 w-4" />
//             Verification Pending
//         </span>
//     );
// }

// export default function AdminFreelancerDetailPage() {
//     const params = useParams();

//     const freelancerId = Array.isArray(
//         params.freelancerId
//     )
//         ? params.freelancerId[0]
//         : params.freelancerId;

//     const [freelancer, setFreelancer] =
//         useState<FreelancerRecord | null>(
//             null
//         );

//     const [loading, setLoading] =
//         useState(true);

//     const [error, setError] =
//         useState<string | null>(null);

//     useEffect(() => {
//         async function loadFreelancer() {
//             if (!freelancerId) {
//                 setError(
//                     "Freelancer ID is missing."
//                 );

//                 setLoading(false);

//                 return;
//             }

//             try {
//                 setLoading(true);
//                 setError(null);

//                 const freelancerRef =
//                     doc(
//                         db,
//                         "SkillMembers",
//                         freelancerId
//                     );

//                 const snapshot =
//                     await getDoc(
//                         freelancerRef
//                     );

//                 if (!snapshot.exists()) {
//                     setError(
//                         "Freelancer could not be found."
//                     );

//                     return;
//                 }

//                 const data =
//                     snapshot.data();

//                 const loadedFreelancer:
//                     FreelancerRecord = {
//                     id: snapshot.id,

//                     userId:
//                         typeof data.userId ===
//                         "string"
//                             ? data.userId
//                             : undefined,

//                     skillId:
//                         typeof data.skillId ===
//                         "string"
//                             ? data.skillId
//                             : undefined,

//                     firstName:
//                         typeof data.firstName ===
//                         "string"
//                             ? data.firstName
//                             : undefined,

//                     lastName:
//                         typeof data.lastName ===
//                         "string"
//                             ? data.lastName
//                             : undefined,

//                     profileImageUrl:
//                         typeof data.profileImageUrl ===
//                         "string"
//                             ? data.profileImageUrl
//                             : undefined,

//                     skillSamplePhotoUrl:
//                         typeof data.skillSamplePhotoUrl ===
//                         "string"
//                             ? data.skillSamplePhotoUrl
//                             : undefined,

//                     aboutMemberSkill:
//                         typeof data.aboutMemberSkill ===
//                         "string"
//                             ? data.aboutMemberSkill
//                             : undefined,

//                     isVerified:
//                         data.isVerified === true,

//                     startingPrice:
//                         typeof data.startingPrice ===
//                         "number"
//                             ? data.startingPrice
//                             : undefined,

//                     rating:
//                         typeof data.rating ===
//                         "number"
//                             ? data.rating
//                             : undefined,

//                     rating3:
//                         typeof data.rating3 ===
//                         "number"
//                             ? data.rating3
//                             : undefined,

//                     ratingTotal:
//                         typeof data.ratingTotal ===
//                         "number"
//                             ? data.ratingTotal
//                             : undefined,

//                     reviewCount:
//                         typeof data.reviewCount ===
//                         "number"
//                             ? data.reviewCount
//                             : undefined,

//                     completedJobs:
//                         typeof data.completedJobs ===
//                         "number"
//                             ? data.completedJobs
//                             : undefined,

//                     rankingScore:
//                         typeof data.rankingScore ===
//                         "number"
//                             ? data.rankingScore
//                             : undefined,

//                     popularityScore:
//                         typeof data.popularityScore ===
//                         "number"
//                             ? data.popularityScore
//                             : undefined,

//                     latitude:
//                         typeof data.latitude ===
//                         "number"
//                             ? data.latitude
//                             : undefined,

//                     longitude:
//                         typeof data.longitude ===
//                         "number"
//                             ? data.longitude
//                             : undefined,

//                     createdAt:
//                         getDate(
//                             data.createdAt
//                         ),

//                     updatedLocationAt:
//                         getDate(
//                             data.updatedLocationAt
//                         ),
//                 };

//                 setFreelancer(
//                     loadedFreelancer
//                 );
//             } catch (err) {
//                 console.error(
//                     "Failed to load freelancer:",
//                     err
//                 );

//                 setError(
//                     "Unable to load this freelancer."
//                 );
//             } finally {
//                 setLoading(false);
//             }
//         }

//         loadFreelancer();
//     }, [freelancerId]);

//     /*
//      * Loading
//      */

//     if (loading) {
//         return (
//             <main className="min-h-screen bg-slate-50">

//                 <div className="border-b border-slate-200 bg-white">

//                     <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">

//                         <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />

//                     </div>

//                 </div>

//                 <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

//                     <section
//                         className="
//                             overflow-hidden
//                             rounded-3xl
//                             border
//                             border-slate-200
//                             bg-white
//                             shadow-sm
//                         "
//                     >

//                         <div className="h-32 animate-pulse bg-slate-200" />

//                         <div className="px-6 pb-8 lg:px-8">

//                             <div className="-mt-14 flex items-end gap-5">

//                                 <div className="h-28 w-28 animate-pulse rounded-2xl border-4 border-white bg-slate-200" />

//                                 <div className="space-y-3 pb-2">

//                                     <div className="h-7 w-52 animate-pulse rounded bg-slate-200" />

//                                     <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />

//                                 </div>

//                             </div>

//                         </div>

//                     </section>

//                     <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

//                         {Array.from({
//                             length: 4,
//                         }).map(
//                             (_, index) => (
//                                 <div
//                                     key={index}
//                                     className="h-32 animate-pulse rounded-2xl bg-slate-200"
//                                 />
//                             )
//                         )}

//                     </div>

//                 </div>

//             </main>
//         );
//     }

//     /*
//      * Error
//      */

//     if (error || !freelancer) {
//         return (
//             <main className="min-h-screen bg-slate-50">

//                 <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

//                     <Link
//                         href="/admin/freelancers"
//                         className="
//                             inline-flex
//                             items-center
//                             gap-2
//                             text-sm
//                             font-semibold
//                             text-slate-600
//                             transition
//                             hover:text-blue-600
//                         "
//                     >
//                         <ArrowLeft className="h-4 w-4" />
//                         Back to Freelancers
//                     </Link>

//                     <div
//                         className="
//                             mt-8
//                             rounded-2xl
//                             border
//                             border-red-200
//                             bg-red-50
//                             p-8
//                             text-center
//                         "
//                     >

//                         <User className="mx-auto h-10 w-10 text-red-400" />

//                         <h1 className="mt-4 text-lg font-semibold text-red-800">
//                             Unable to load freelancer
//                         </h1>

//                         <p className="mt-2 text-sm text-red-600">
//                             {error ??
//                                 "Freelancer could not be found."}
//                         </p>

//                     </div>

//                 </div>

//             </main>
//         );
//     }

//     const displayName =
//         getFreelancerName(
//             freelancer
//         );

//     return (
//         <main className="min-h-screen bg-slate-50">

//             {/* ================================================= */}
//             {/* HEADER */}
//             {/* ================================================= */}

//             <div className="border-b border-slate-200 bg-white">

//                 <div
//                     className="
//                         mx-auto
//                         max-w-7xl
//                         px-6
//                         py-6
//                         lg:px-8
//                     "
//                 >

//                     <div className="flex flex-wrap items-center justify-between gap-4">

//                         <Link
//                             href="/admin/freelancers"
//                             className="
//                                 inline-flex
//                                 items-center
//                                 gap-2
//                                 text-sm
//                                 font-semibold
//                                 text-slate-600
//                                 transition
//                                 hover:text-blue-600
//                             "
//                         >
//                             <ArrowLeft className="h-4 w-4" />
//                             Back to Freelancers
//                         </Link>

//                         {freelancer.userId && (
//                             <Link
//                                 href={`/admin/users/${freelancer.userId}`}
//                                 className="
//                                     inline-flex
//                                     items-center
//                                     gap-2
//                                     rounded-xl
//                                     border
//                                     border-slate-200
//                                     bg-white
//                                     px-4
//                                     py-2.5
//                                     text-sm
//                                     font-semibold
//                                     text-slate-700
//                                     shadow-sm
//                                     transition
//                                     hover:border-blue-200
//                                     hover:bg-blue-50
//                                     hover:text-blue-700
//                                 "
//                             >
//                                 <User className="h-4 w-4" />
//                                 View User Profile
//                             </Link>
//                         )}

//                     </div>

//                 </div>

//             </div>

//             {/* ================================================= */}
//             {/* MAIN */}
//             {/* ================================================= */}

//             <div
//                 className="
//                     mx-auto
//                     max-w-7xl
//                     px-6
//                     py-8
//                     lg:px-8
//                 "
//             >

//                 {/* ================================================= */}
//                 {/* PROFILE HEADER */}
//                 {/* ================================================= */}

//                 <section
//                     className="
//                         overflow-hidden
//                         rounded-3xl
//                         border
//                         border-slate-200
//                         bg-white
//                         shadow-sm
//                     "
//                 >

//                     <div
//                         className="
//                             h-32
//                             bg-gradient-to-r
//                             from-blue-700
//                             via-blue-600
//                             to-sky-500
//                         "
//                     />

//                     <div className="px-6 pb-8 lg:px-8">

//                         <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

//                             <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

//                                 {/* Profile image */}

//                                 {freelancer.profileImageUrl ? (

//                                     <img
//                                         src={
//                                             freelancer.profileImageUrl
//                                         }
//                                         alt={
//                                             displayName
//                                         }
//                                         className="
//                                             h-28
//                                             w-28
//                                             rounded-2xl
//                                             border-4
//                                             border-white
//                                             object-cover
//                                             shadow-lg
//                                         "
//                                     />

//                                 ) : (

//                                     <div
//                                         className="
//                                             flex
//                                             h-28
//                                             w-28
//                                             items-center
//                                             justify-center
//                                             rounded-2xl
//                                             border-4
//                                             border-white
//                                             bg-blue-100
//                                             text-3xl
//                                             font-bold
//                                             text-blue-700
//                                             shadow-lg
//                                         "
//                                     >
//                                         {displayName
//                                             .split(" ")
//                                             .map(
//                                                 (
//                                                     part
//                                                 ) =>
//                                                     part[0]
//                                             )
//                                             .join("")
//                                             .substring(
//                                                 0,
//                                                 2
//                                             )
//                                             .toUpperCase()}
//                                     </div>

//                                 )}

//                                 <div className="pb-1">

//                                     <div className="flex flex-wrap items-center gap-3">

//                                         <h1 className="text-2xl font-bold text-slate-900">
//                                             {displayName}
//                                         </h1>

//                                         <VerificationBadge
//                                             verified={
//                                                 freelancer.isVerified
//                                             }
//                                         />

//                                     </div>

//                                     <p className="mt-1 text-sm font-medium text-blue-600">
//                                         {freelancer.skillId ??
//                                             "Unknown Skill"}
//                                     </p>

//                                     <p className="mt-1 text-xs text-slate-400">
//                                         SkillMember ID:{" "}
//                                         {freelancer.id}
//                                     </p>

//                                 </div>

//                             </div>

//                         </div>

//                     </div>

//                 </section>

//                 {/* ================================================= */}
//                 {/* STATISTICS */}
//                 {/* ================================================= */}

//                 <div
//                     className="
//                         mt-8
//                         grid
//                         gap-5
//                         sm:grid-cols-2
//                         lg:grid-cols-4
//                     "
//                 >

//                     <StatCard
//                         icon={Star}
//                         label="Rating"
//                         value={formatRating(
//                             freelancer.rating
//                         )}
//                         description={
//                             freelancer.reviewCount !==
//                             undefined
//                                 ? `${freelancer.reviewCount} review${freelancer.reviewCount === 1 ? "" : "s"}`
//                                 : undefined
//                         }
//                     />

//                     <StatCard
//                         icon={BriefcaseBusiness}
//                         label="Completed Jobs"
//                         value={String(
//                             freelancer.completedJobs ??
//                             0
//                         )}
//                         description="Successfully completed"
//                     />

//                     <StatCard
//                         icon={DollarSign}
//                         label="Starting Price"
//                         value={formatCurrency(
//                             freelancer.startingPrice
//                         )}
//                         description="Listed starting price"
//                     />

//                     <StatCard
//                         icon={TrendingUp}
//                         label="Popularity"
//                         value={String(
//                             freelancer.popularityScore ??
//                             0
//                         )}
//                         description="Popularity score"
//                     />

//                 </div>

//                 {/* ================================================= */}
//                 {/* CONTENT GRID */}
//                 {/* ================================================= */}

//                 <div className="mt-8 grid gap-8 lg:grid-cols-3">

//                     {/* ================================================= */}
//                     {/* LEFT */}
//                     {/* ================================================= */}

//                     <div className="space-y-8 lg:col-span-2">

//                         {/* About service */}

//                         <section
//                             className="
//                                 rounded-2xl
//                                 border
//                                 border-slate-200
//                                 bg-white
//                                 p-6
//                                 shadow-sm
//                             "
//                         >

//                             <div className="flex items-center gap-3">

//                                 <div
//                                     className="
//                                         flex
//                                         h-10
//                                         w-10
//                                         items-center
//                                         justify-center
//                                         rounded-xl
//                                         bg-blue-50
//                                     "
//                                 >
//                                     <FileText className="h-5 w-5 text-blue-600" />
//                                 </div>

//                                 <div>

//                                     <h2 className="font-semibold text-slate-900">
//                                         Service Description
//                                     </h2>

//                                     <p className="text-xs text-slate-400">
//                                         Freelancer's description for this skill
//                                     </p>

//                                 </div>

//                             </div>

//                             <p className="mt-5 whitespace-pre-wrap leading-7 text-slate-600">
//                                 {freelancer.aboutMemberSkill ||
//                                     "No service description provided."}
//                             </p>

//                         </section>

//                         {/* Skill sample */}

//                         <section
//                             className="
//                                 overflow-hidden
//                                 rounded-2xl
//                                 border
//                                 border-slate-200
//                                 bg-white
//                                 shadow-sm
//                             "
//                         >

//                             <div className="p-6">

//                                 <div className="flex items-center gap-3">

//                                     <div
//                                         className="
//                                             flex
//                                             h-10
//                                             w-10
//                                             items-center
//                                             justify-center
//                                             rounded-xl
//                                             bg-blue-50
//                                         "
//                                     >
//                                         <BriefcaseBusiness className="h-5 w-5 text-blue-600" />
//                                     </div>

//                                     <div>

//                                         <h2 className="font-semibold text-slate-900">
//                                             Skill Profile
//                                         </h2>

//                                         <p className="text-xs text-slate-400">
//                                             Skill-specific freelancer information
//                                         </p>

//                                     </div>

//                                 </div>

//                                 <div className="mt-6 grid gap-6 sm:grid-cols-2">

//                                     <InfoItem
//                                         icon={BriefcaseBusiness}
//                                         label="Skill"
//                                         value={
//                                             freelancer.skillId ??
//                                             "Not specified"
//                                         }
//                                     />

//                                     <InfoItem
//                                         icon={DollarSign}
//                                         label="Starting Price"
//                                         value={formatCurrency(
//                                             freelancer.startingPrice
//                                         )}
//                                     />

//                                     <InfoItem
//                                         icon={ShieldCheck}
//                                         label="Verification"
//                                         value={
//                                             freelancer.isVerified
//                                                 ? "Verified"
//                                                 : "Not verified"
//                                         }
//                                     />

//                                     <InfoItem
//                                         icon={Medal}
//                                         label="Ranking Score"
//                                         value={String(
//                                             freelancer.rankingScore ??
//                                             0
//                                         )}
//                                     />

//                                 </div>

//                             </div>

//                             {freelancer.skillSamplePhotoUrl && (
//                                 <div className="border-t border-slate-200 bg-slate-50 p-6">

//                                     <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
//                                         Skill Sample Photo
//                                     </p>

//                                     <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

//                                         <img
//                                             src={
//                                                 freelancer.skillSamplePhotoUrl
//                                             }
//                                             alt={`${freelancer.skillId ?? "Skill"} sample`}
//                                             className="
//                                                 max-h-[520px]
//                                                 w-full
//                                                 object-contain
//                                             "
//                                         />

//                                     </div>

//                                 </div>
//                             )}

//                         </section>

//                         {/* Ratings */}

//                         <section
//                             className="
//                                 rounded-2xl
//                                 border
//                                 border-slate-200
//                                 bg-white
//                                 p-6
//                                 shadow-sm
//                             "
//                         >

//                             <div className="flex items-center gap-3">

//                                 <div
//                                     className="
//                                         flex
//                                         h-10
//                                         w-10
//                                         items-center
//                                         justify-center
//                                         rounded-xl
//                                         bg-amber-50
//                                     "
//                                 >
//                                     <Star className="h-5 w-5 text-amber-500" />
//                                 </div>

//                                 <div>

//                                     <h2 className="font-semibold text-slate-900">
//                                         Ratings & Reviews
//                                     </h2>

//                                     <p className="text-xs text-slate-400">
//                                         Current freelancer performance metrics
//                                     </p>

//                                 </div>

//                             </div>

//                             <div className="mt-6 grid gap-5 sm:grid-cols-3">

//                                 <div className="rounded-xl bg-slate-50 p-5 text-center">

//                                     <Star className="mx-auto h-6 w-6 fill-current text-amber-400" />

//                                     <p className="mt-2 text-2xl font-bold text-slate-900">
//                                         {formatRating(
//                                             freelancer.rating
//                                         )}
//                                     </p>

//                                     <p className="mt-1 text-xs text-slate-400">
//                                         Overall rating
//                                     </p>

//                                 </div>

//                                 <div className="rounded-xl bg-slate-50 p-5 text-center">

//                                     <Users className="mx-auto h-6 w-6 text-blue-500" />

//                                     <p className="mt-2 text-2xl font-bold text-slate-900">
//                                         {freelancer.reviewCount ??
//                                             0}
//                                     </p>

//                                     <p className="mt-1 text-xs text-slate-400">
//                                         Reviews
//                                     </p>

//                                 </div>

//                                 <div className="rounded-xl bg-slate-50 p-5 text-center">

//                                     <CheckCircle2 className="mx-auto h-6 w-6 text-green-500" />

//                                     <p className="mt-2 text-2xl font-bold text-slate-900">
//                                         {freelancer.completedJobs ??
//                                             0}
//                                     </p>

//                                     <p className="mt-1 text-xs text-slate-400">
//                                         Completed jobs
//                                     </p>

//                                 </div>

//                             </div>

//                         </section>

//                     </div>

//                     {/* ================================================= */}
//                     {/* RIGHT */}
//                     {/* ================================================= */}

//                     <aside className="space-y-8">

//                         {/* Freelancer information */}

//                         <section
//                             className="
//                                 rounded-2xl
//                                 border
//                                 border-slate-200
//                                 bg-white
//                                 p-6
//                                 shadow-sm
//                             "
//                         >

//                             <h2 className="font-semibold text-slate-900">
//                                 Freelancer Information
//                             </h2>

//                             <div className="mt-5 space-y-5">

//                                 <InfoItem
//                                     icon={User}
//                                     label="Name"
//                                     value={
//                                         displayName
//                                     }
//                                 />

//                                 <InfoItem
//                                     icon={BriefcaseBusiness}
//                                     label="Skill"
//                                     value={
//                                         freelancer.skillId ??
//                                         "Not specified"
//                                     }
//                                 />

//                                 <InfoItem
//                                     icon={ShieldCheck}
//                                     label="Verification"
//                                     value={
//                                         freelancer.isVerified
//                                             ? "Verified"
//                                             : "Not verified"
//                                     }
//                                 />

//                                 <InfoItem
//                                     icon={CalendarDays}
//                                     label="Joined"
//                                     value={formatDate(
//                                         freelancer.createdAt ??
//                                         null
//                                     )}
//                                 />

//                             </div>

//                         </section>

//                         {/* Location */}

//                         <section
//                             className="
//                                 rounded-2xl
//                                 border
//                                 border-slate-200
//                                 bg-white
//                                 p-6
//                                 shadow-sm
//                             "
//                         >

//                             <div className="flex items-center gap-3">

//                                 <div
//                                     className="
//                                         flex
//                                         h-10
//                                         w-10
//                                         items-center
//                                         justify-center
//                                         rounded-xl
//                                         bg-blue-50
//                                     "
//                                 >
//                                     <MapPin className="h-5 w-5 text-blue-600" />
//                                 </div>

//                                 <div>

//                                     <h2 className="font-semibold text-slate-900">
//                                         Location
//                                     </h2>

//                                     <p className="text-xs text-slate-400">
//                                         Latest freelancer location
//                                     </p>

//                                 </div>

//                             </div>

//                             <div className="mt-5 space-y-3">

//                                 <div className="flex justify-between gap-4 text-sm">

//                                     <span className="text-slate-400">
//                                         Latitude
//                                     </span>

//                                     <span className="font-medium text-slate-700">
//                                         {freelancer.latitude ??
//                                             "—"}
//                                     </span>

//                                 </div>

//                                 <div className="flex justify-between gap-4 text-sm">

//                                     <span className="text-slate-400">
//                                         Longitude
//                                     </span>

//                                     <span className="font-medium text-slate-700">
//                                         {freelancer.longitude ??
//                                             "—"}
//                                     </span>

//                                 </div>

//                                 <div className="flex justify-between gap-4 text-sm">

//                                     <span className="text-slate-400">
//                                         Updated
//                                     </span>

//                                     <span className="text-right font-medium text-slate-700">
//                                         {formatDateTime(
//                                             freelancer.updatedLocationAt ??
//                                             null
//                                         )}
//                                     </span>

//                                 </div>

//                             </div>

//                         </section>

//                         {/* Activity */}

//                         <section
//                             className="
//                                 rounded-2xl
//                                 border
//                                 border-slate-200
//                                 bg-white
//                                 p-6
//                                 shadow-sm
//                             "
//                         >

//                             <h2 className="font-semibold text-slate-900">
//                                 Activity
//                             </h2>

//                             <div className="mt-5 space-y-5">

//                                 <InfoItem
//                                     icon={
//                                         CalendarDays
//                                     }
//                                     label="Created"
//                                     value={formatDateTime(
//                                         freelancer.createdAt ??
//                                         null
//                                     )}
//                                 />

//                                 <InfoItem
//                                     icon={
//                                         MapPin
//                                     }
//                                     label="Location Updated"
//                                     value={formatDateTime(
//                                         freelancer.updatedLocationAt ??
//                                         null
//                                     )}
//                                 />

//                             </div>

//                         </section>

//                         {/* IDs */}

//                         <section
//                             className="
//                                 rounded-2xl
//                                 border
//                                 border-slate-200
//                                 bg-white
//                                 p-6
//                                 shadow-sm
//                             "
//                         >

//                             <h2 className="font-semibold text-slate-900">
//                                 System Information
//                             </h2>

//                             <div className="mt-5 space-y-4">

//                                 <div>

//                                     <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                                         SkillMember ID
//                                     </p>

//                                     <p className="mt-1 break-all rounded-lg bg-slate-50 p-3 font-mono text-xs text-slate-600">
//                                         {freelancer.id}
//                                     </p>

//                                 </div>

//                                 <div>

//                                     <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                                         User ID
//                                     </p>

//                                     <p className="mt-1 break-all rounded-lg bg-slate-50 p-3 font-mono text-xs text-slate-600">
//                                         {freelancer.userId ??
//                                             "—"}
//                                     </p>

//                                 </div>

//                             </div>

//                         </section>

//                     </aside>

//                 </div>

//             </div>

//         </main>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    ArrowLeft,
    BadgeCheck,
    BriefcaseBusiness,
    CalendarDays,
    CheckCircle2,
    Clock,
    DollarSign,
    MapPin,
    Star,
    TrendingUp,
    User,
    UserX,
    XCircle,
} from "lucide-react";

import {
    doc,
    getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

/*
 * =====================================================
 * TYPES
 * =====================================================
 */

type FreelancerRecord = {
    id: string;

    userId?: string;

    skillId?: string;

    firstName?: string;
    lastName?: string;

    profileImageUrl?: string;
    skillSamplePhotoUrl?: string;

    startingPrice?: number;

    aboutMemberSkill?: string;

    isVerified?: boolean;

    rating?: number;
    rating3?: number;
    ratingTotal?: number;

    reviewCount?: number;
    completedJobs?: number;

    rankingScore?: number;
    popularityScore?: number;

    latitude?: number;
    longitude?: number;

    createdAt?: Date | null;
    updatedLocationAt?: Date | null;
};

type UserRecord = {
    id: string;

    name?: string;

    firstName?: string;
    middleName?: string;
    lastName?: string;

    email?: string;
    phoneNumber?: string;

    gender?: string;
    about?: string;

    profileImageUrl?: string;

    isVerified?: boolean;
    isAdmin?: boolean;
    banned?: boolean;
    isDeleted?: boolean;

    status?: string;

    createdAt?: Date | null;
    lastOnlineStatus?: Date | null;
};

/*
 * =====================================================
 * HELPERS
 * =====================================================
 */

function getDate(value: unknown): Date | null {
    if (
        value &&
        typeof value === "object" &&
        "toDate" in value &&
        typeof (
            value as {
                toDate: () => Date;
            }
        ).toDate === "function"
    ) {
        return (
            value as {
                toDate: () => Date;
            }
        ).toDate();
    }

    if (value instanceof Date) {
        return value;
    }

    return null;
}

function getString(
    value: unknown
): string | undefined {
    return typeof value === "string"
        ? value
        : undefined;
}

function getNumber(
    value: unknown
): number | undefined {
    return typeof value === "number"
        ? value
        : undefined;
}

function getBoolean(
    value: unknown
): boolean {
    return value === true;
}

function getUserName(
    user?: UserRecord | null,
    freelancer?: FreelancerRecord | null
) {
    if (user?.name?.trim()) {
        return user.name;
    }

    const userFullName = [
        user?.firstName,
        user?.middleName,
        user?.lastName,
    ]
        .filter(Boolean)
        .join(" ")
        .trim();

    if (userFullName) {
        return userFullName;
    }

    const freelancerFullName = [
        freelancer?.firstName,
        freelancer?.lastName,
    ]
        .filter(Boolean)
        .join(" ")
        .trim();

    return freelancerFullName || "Unnamed Freelancer";
}

function getInitials(
    name: string
) {
    if (!name.trim()) {
        return "?";
    }

    const parts = name
        .split(" ")
        .filter(Boolean);

    if (parts.length === 1) {
        return parts[0]
            .substring(0, 2)
            .toUpperCase();
    }

    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();
}

function formatDate(
    date: Date | null
) {
    if (!date) {
        return "—";
    }

    return date.toLocaleDateString(
        "en-PH",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
        }
    );
}

function formatDateTime(
    date: Date | null
) {
    if (!date) {
        return "—";
    }

    return date.toLocaleString(
        "en-PH",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        }
    );
}

function formatPrice(
    value?: number
) {
    if (
        value === undefined ||
        Number.isNaN(value)
    ) {
        return "—";
    }

    return new Intl.NumberFormat(
        "en-PH",
        {
            style: "currency",
            currency: "PHP",
            maximumFractionDigits: 0,
        }
    ).format(value);
}

function formatRating(
    value?: number
) {
    if (
        value === undefined ||
        Number.isNaN(value)
    ) {
        return "—";
    }

    return value.toFixed(1);
}

/*
 * =====================================================
 * STAT CARD
 * =====================================================
 */

function StatCard({
    icon: Icon,
    label,
    value,
    description,
}: {
    icon: typeof Star;
    label: string;
    value: string;
    description?: string;
}) {
    return (
        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
            "
        >
            <div className="flex items-start justify-between gap-4">

                <div>

                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {label}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-900">
                        {value}
                    </p>

                    {description && (
                        <p className="mt-1 text-xs text-slate-400">
                            {description}
                        </p>
                    )}

                </div>

                <div
                    className="
                        flex
                        h-10
                        w-10
                        flex-shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-50
                    "
                >
                    <Icon className="h-5 w-5 text-blue-600" />
                </div>

            </div>
        </div>
    );
}

/*
 * =====================================================
 * INFO ITEM
 * =====================================================
 */

function InfoItem({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof User;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3">

            <div
                className="
                    mt-0.5
                    flex
                    h-9
                    w-9
                    flex-shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-slate-100
                "
            >
                <Icon className="h-4 w-4 text-slate-500" />
            </div>

            <div className="min-w-0">

                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {label}
                </p>

                <p className="mt-1 break-words text-sm font-medium text-slate-800">
                    {value}
                </p>

            </div>

        </div>
    );
}

/*
 * =====================================================
 * VERIFICATION BADGE
 * =====================================================
 */

function VerificationBadge({
    verified,
}: {
    verified?: boolean;
}) {
    if (verified) {
        return (
            <span
                className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-green-50
                    px-3
                    py-1.5
                    text-sm
                    font-semibold
                    text-green-700
                "
            >
                <BadgeCheck className="h-4 w-4" />
                Verified Freelancer
            </span>
        );
    }

    return (
        <span
            className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-orange-50
                px-3
                py-1.5
                text-sm
                font-semibold
                text-orange-700
            "
        >
            <XCircle className="h-4 w-4" />
            Not Verified
        </span>
    );
}

/*
 * =====================================================
 * PAGE
 * =====================================================
 */

export default function AdminFreelancerDetailPage() {

    const params = useParams();

    const freelancerId =
        Array.isArray(params.freelancerId)
            ? params.freelancerId[0]
            : params.freelancerId;

    const [freelancer, setFreelancer] =
        useState<FreelancerRecord | null>(null);

    const [user, setUser] =
        useState<UserRecord | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    /*
     * =================================================
     * LOAD FREELANCER
     * =================================================
     */

    useEffect(() => {

        async function loadFreelancer() {

            if (!freelancerId) {
                setError(
                    "Freelancer ID is missing."
                );

                setLoading(false);

                return;
            }

            try {

                setLoading(true);
                setError(null);

                /*
                 * The freelancer ID is the
                 * SkillMembers document ID.
                 */

                const freelancerRef =
                    doc(
                        db,
                        "SkillMembers",
                        freelancerId
                    );

                const freelancerSnapshot =
                    await getDoc(
                        freelancerRef
                    );

                if (
                    !freelancerSnapshot.exists()
                ) {
                    setError(
                        "Freelancer profile could not be found."
                    );

                    return;
                }

                const data =
                    freelancerSnapshot.data();

                const loadedFreelancer:
                    FreelancerRecord = {

                    id:
                        freelancerSnapshot.id,

                    userId:
                        getString(
                            data.userId
                        ),

                    skillId:
                        getString(
                            data.skillId
                        ),

                    firstName:
                        getString(
                            data.firstName
                        ),

                    lastName:
                        getString(
                            data.lastName
                        ),

                    skillSamplePhotoUrl:
                        getString(
                            data.skillSamplePhotoUrl
                        ),

                    profileImageUrl:
                        getString(
                            data.profileImageUrl
                        ),

                    startingPrice:
                        getNumber(
                            data.startingPrice
                        ),

                    aboutMemberSkill:
                        getString(
                            data.aboutMemberSkill
                        ),

                    isVerified:
                        getBoolean(
                            data.isVerified
                        ),

                    rating:
                        getNumber(
                            data.rating
                        ),

                    rating3:
                        getNumber(
                            data.rating3
                        ),

                    ratingTotal:
                        getNumber(
                            data.ratingTotal
                        ),

                    reviewCount:
                        getNumber(
                            data.reviewCount
                        ),

                    completedJobs:
                        getNumber(
                            data.completedJobs
                        ),

                    rankingScore:
                        getNumber(
                            data.rankingScore
                        ),

                    popularityScore:
                        getNumber(
                            data.popularityScore
                        ),

                    latitude:
                        getNumber(
                            data.latitude
                        ),

                    longitude:
                        getNumber(
                            data.longitude
                        ),

                    createdAt:
                        getDate(
                            data.createdAt
                        ),

                    updatedLocationAt:
                        getDate(
                            data.updatedLocationAt
                        ),
                };

                setFreelancer(
                    loadedFreelancer
                );

                /*
                 * =============================================
                 * LOAD LINKED USER
                 * =============================================
                 *
                 * SkillMembers.userId points to Users/{userId}
                 */

                if (
                    loadedFreelancer.userId
                ) {

                    const userRef =
                        doc(
                            db,
                            "Users",
                            loadedFreelancer.userId
                        );

                    const userSnapshot =
                        await getDoc(
                            userRef
                        );

                    if (
                        userSnapshot.exists()
                    ) {

                        const userData =
                            userSnapshot.data();

                        const loadedUser:
                            UserRecord = {

                            id:
                                userSnapshot.id,

                            name:
                                getString(
                                    userData.name
                                ),

                            firstName:
                                getString(
                                    userData.firstName
                                ),

                            middleName:
                                getString(
                                    userData.middleName
                                ),

                            lastName:
                                getString(
                                    userData.lastName
                                ),

                            email:
                                getString(
                                    userData.email
                                ),

                            phoneNumber:
                                getString(
                                    userData.phoneNumber
                                ),

                            gender:
                                getString(
                                    userData.gender
                                ),

                            about:
                                getString(
                                    userData.about
                                ),

                            profileImageUrl:
                                getString(
                                    userData.profileImageUrl
                                ),

                            isVerified:
                                getBoolean(
                                    userData.isVerified
                                ),

                            isAdmin:
                                getBoolean(
                                    userData.isAdmin
                                ),

                            banned:
                                getBoolean(
                                    userData.banned
                                ),

                            isDeleted:
                                getBoolean(
                                    userData.isDeleted
                                ),

                            status:
                                getString(
                                    userData.status
                                ),

                            createdAt:
                                getDate(
                                    userData.createdAt
                                ),

                            lastOnlineStatus:
                                getDate(
                                    userData.lastOnlineStatus
                                ),
                        };

                        setUser(
                            loadedUser
                        );
                    }
                }

            } catch (err) {

                console.error(
                    "Failed to load freelancer:",
                    err
                );

                setError(
                    "Unable to load this freelancer profile."
                );

            } finally {

                setLoading(false);

            }
        }

        loadFreelancer();

    }, [freelancerId]);

    /*
     * =================================================
     * LOADING
     * =================================================
     */

    if (loading) {

        return (
            <main className="min-h-screen bg-slate-50">

                <div className="border-b border-slate-200 bg-white">

                    <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">

                        <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />

                    </div>

                </div>

                <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

                    <div
                        className="
                            overflow-hidden
                            rounded-3xl
                            border
                            border-slate-200
                            bg-white
                        "
                    >

                        <div className="h-36 animate-pulse bg-slate-200" />

                        <div className="p-8">

                            <div className="flex items-center gap-5">

                                <div className="h-28 w-28 animate-pulse rounded-2xl bg-slate-200" />

                                <div className="space-y-3">

                                    <div className="h-6 w-56 animate-pulse rounded bg-slate-200" />

                                    <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />

                                    <div className="h-7 w-32 animate-pulse rounded-full bg-slate-100" />

                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

                        {Array.from({
                            length: 4,
                        }).map(
                            (_, index) => (
                                <div
                                    key={index}
                                    className="h-32 animate-pulse rounded-2xl bg-white"
                                />
                            )
                        )}

                    </div>

                </div>

            </main>
        );
    }

    /*
     * =================================================
     * ERROR
     * =================================================
     */

    if (
        error ||
        !freelancer
    ) {

        return (
            <main className="min-h-screen bg-slate-50">

                <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

                    <Link
                        href="/admin/freelancers"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-sm
                            font-semibold
                            text-slate-600
                            transition
                            hover:text-blue-600
                        "
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Freelancers
                    </Link>

                    <div
                        className="
                            mt-8
                            rounded-2xl
                            border
                            border-red-200
                            bg-red-50
                            p-8
                            text-center
                        "
                    >

                        <UserX className="mx-auto h-10 w-10 text-red-400" />

                        <h1 className="mt-4 text-lg font-semibold text-red-800">
                            Unable to load freelancer
                        </h1>

                        <p className="mt-2 text-sm text-red-600">
                            {error ??
                                "Freelancer profile could not be found."}
                        </p>

                    </div>

                </div>

            </main>
        );
    }

    /*
     * =================================================
     * DISPLAY VALUES
     * =================================================
     */

    const displayName =
        getUserName(
            user,
            freelancer
        );

    const profileImage =
        freelancer.profileImageUrl ??
        user?.profileImageUrl;

    const rating =
        freelancer.rating ??
        freelancer.rating3;

    const reviewCount =
        freelancer.reviewCount ??
        0;

    const completedJobs =
        freelancer.completedJobs ??
        0;

    const skillName =
        freelancer.skillId ??
        "Unknown Skill";

    /*
     * =================================================
     * RENDER
     * =================================================
     */

    return (
        <main className="min-h-screen bg-slate-50">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="border-b border-slate-200 bg-white">

                <div
                    className="
                        mx-auto
                        max-w-7xl
                        px-6
                        py-6
                        lg:px-8
                    "
                >

                    <Link
                        href="/admin/freelancers"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-sm
                            font-semibold
                            text-slate-600
                            transition
                            hover:text-blue-600
                        "
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Freelancers
                    </Link>

                </div>

            </div>

            {/* =================================================
                MAIN
            ================================================= */}

            <div
                className="
                    mx-auto
                    max-w-7xl
                    px-6
                    py-8
                    lg:px-8
                "
            >

                {/* =================================================
                    PROFILE HEADER
                ================================================= */}

                <section
                    className="
                        overflow-hidden
                        rounded-3xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                    "
                >

                    <div
                        className="
                            h-36
                            bg-gradient-to-r
                            from-blue-700
                            via-blue-600
                            to-sky-500
                        "
                    />

                    <div className="px-6 pb-8 lg:px-8">

                        <div
                            className="
                                -mt-14
                                flex
                                flex-col
                                gap-6
                                sm:flex-row
                                sm:items-end
                                sm:justify-between
                            "
                        >

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-5
                                    sm:flex-row
                                    sm:items-end
                                "
                            >

                                {/* Profile image */}

                                {profileImage ? (

                                    <img
                                        src={profileImage}
                                        alt={displayName}
                                        className="
                                            h-28
                                            w-28
                                            rounded-2xl
                                            border-4
                                            border-white
                                            object-cover
                                            shadow-lg
                                        "
                                    />

                                ) : (

                                    <div
                                        className="
                                            flex
                                            h-28
                                            w-28
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            border-4
                                            border-white
                                            bg-blue-100
                                            text-3xl
                                            font-bold
                                            text-blue-700
                                            shadow-lg
                                        "
                                    >
                                        {getInitials(
                                            displayName
                                        )}
                                    </div>

                                )}

                                <div className="pb-1">

                                    <h1
                                        className="
                                            text-2xl
                                            font-bold
                                            text-slate-900
                                        "
                                    >
                                        {displayName}
                                    </h1>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {skillName}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        SkillMember ID:{" "}
                                        {freelancer.id}
                                    </p>

                                    <div className="mt-3 flex flex-wrap gap-2">

                                        <VerificationBadge
                                            verified={
                                                freelancer.isVerified
                                            }
                                        />

                                        {user?.status && (
                                            <span
                                                className="
                                                    inline-flex
                                                    items-center
                                                    gap-2
                                                    rounded-full
                                                    bg-slate-100
                                                    px-3
                                                    py-1.5
                                                    text-sm
                                                    font-medium
                                                    text-slate-600
                                                "
                                            >

                                                <span
                                                    className={`
                                                        h-2
                                                        w-2
                                                        rounded-full
                                                        ${user.status.toLowerCase() ===
                                                            "online"
                                                            ? "bg-green-500"
                                                            : "bg-slate-300"
                                                        }
                                                    `}
                                                />

                                                {user.status}

                                            </span>
                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                {/* =================================================
                    PERFORMANCE STATS
                ================================================= */}

                <div
                    className="
                        mt-8
                        grid
                        gap-5
                        sm:grid-cols-2
                        lg:grid-cols-4
                    "
                >

                    <StatCard
                        icon={Star}
                        label="Rating"
                        value={
                            rating !== undefined
                                ? `${formatRating(rating)} / 5`
                                : "—"
                        }
                        description={
                            `${reviewCount} review${reviewCount === 1
                                ? ""
                                : "s"
                            }`
                        }
                    />

                    <StatCard
                        icon={BriefcaseBusiness}
                        label="Completed Jobs"
                        value={completedJobs.toString()}
                        description="Successfully completed"
                    />

                    <StatCard
                        icon={DollarSign}
                        label="Starting Price"
                        value={formatPrice(
                            freelancer.startingPrice
                        )}
                        description="Listed service price"
                    />

                    <StatCard
                        icon={TrendingUp}
                        label="Popularity Score"
                        value={
                            freelancer.popularityScore !==
                                undefined
                                ? freelancer.popularityScore.toString()
                                : "—"
                        }
                        description="Platform ranking metric"
                    />

                </div>

                {/* =================================================
                    CONTENT GRID
                ================================================= */}

                <div
                    className="
                        mt-8
                        grid
                        gap-8
                        lg:grid-cols-3
                    "
                >

                    {/* =================================================
                        LEFT
                    ================================================= */}

                    <div
                        className="
                            space-y-8
                            lg:col-span-2
                        "
                    >

                        {/* About */}

                        <section
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                            "
                        >

                            <div className="flex items-center gap-3">

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-50
                                    "
                                >
                                    <User className="h-5 w-5 text-blue-600" />
                                </div>

                                <div>

                                    <h2 className="font-semibold text-slate-900">
                                        About This Freelancer
                                    </h2>

                                    <p className="text-xs text-slate-400">
                                        Service profile description
                                    </p>

                                </div>

                            </div>

                            <p
                                className="
                                    mt-5
                                    whitespace-pre-wrap
                                    leading-7
                                    text-slate-600
                                "
                            >
                                {freelancer.aboutMemberSkill ||
                                    "No freelancer description provided."}
                            </p>

                        </section>

                        {/* Skill information */}

                        <section
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                            "
                        >

                            <div className="flex items-center gap-3">

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-50
                                    "
                                >
                                    <BriefcaseBusiness className="h-5 w-5 text-blue-600" />
                                </div>

                                <div>

                                    <h2 className="font-semibold text-slate-900">
                                        Skill Information
                                    </h2>

                                    <p className="text-xs text-slate-400">
                                        Freelancer service details
                                    </p>

                                </div>

                            </div>

                            <div className="mt-6 grid gap-6 sm:grid-cols-2">

                                <InfoItem
                                    icon={
                                        BriefcaseBusiness
                                    }
                                    label="Skill"
                                    value={
                                        skillName
                                    }
                                />

                                <InfoItem
                                    icon={
                                        DollarSign
                                    }
                                    label="Starting Price"
                                    value={
                                        formatPrice(
                                            freelancer.startingPrice
                                        )
                                    }
                                />

                                <InfoItem
                                    icon={
                                        Star
                                    }
                                    label="Rating"
                                    value={
                                        rating !==
                                            undefined
                                            ? `${formatRating(
                                                rating
                                            )} / 5`
                                            : "No rating"
                                    }
                                />

                                <InfoItem
                                    icon={
                                        CheckCircle2
                                    }
                                    label="Completed Jobs"
                                    value={
                                        completedJobs.toString()
                                    }
                                />

                            </div>

                        </section>

                        {/* Performance */}

                        <section
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                            "
                        >

                            <div className="flex items-center gap-3">

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-50
                                    "
                                >
                                    <TrendingUp className="h-5 w-5 text-blue-600" />
                                </div>

                                <div>

                                    <h2 className="font-semibold text-slate-900">
                                        Performance
                                    </h2>

                                    <p className="text-xs text-slate-400">
                                        Platform ranking and activity metrics
                                    </p>

                                </div>

                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-3">

                                <div className="rounded-xl bg-slate-50 p-4">

                                    <p className="text-xs font-medium text-slate-400">
                                        Ranking Score
                                    </p>

                                    <p className="mt-2 text-xl font-bold text-slate-900">
                                        {freelancer.rankingScore ??
                                            "—"}
                                    </p>

                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">

                                    <p className="text-xs font-medium text-slate-400">
                                        Popularity Score
                                    </p>

                                    <p className="mt-2 text-xl font-bold text-slate-900">
                                        {freelancer.popularityScore ??
                                            "—"}
                                    </p>

                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">

                                    <p className="text-xs font-medium text-slate-400">
                                        Total Rating
                                    </p>

                                    <p className="mt-2 text-xl font-bold text-slate-900">
                                        {freelancer.ratingTotal ??
                                            "—"}
                                    </p>

                                </div>

                            </div>

                        </section>

                        {/* Skill Sample Photo */}

                        {freelancer.skillSamplePhotoUrl && (

                            <section
                                className="
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    shadow-sm
                                "
                            >

                                <div className="p-6">

                                    <div className="flex items-center gap-3">

                                        <div
                                            className="
                                                flex
                                                h-10
                                                w-10
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-blue-50
                                            "
                                        >
                                            <BriefcaseBusiness className="h-5 w-5 text-blue-600" />
                                        </div>

                                        <div>

                                            <h2 className="font-semibold text-slate-900">
                                                Skill Sample
                                            </h2>

                                            <p className="text-xs text-slate-400">
                                                Sample work associated with this skill
                                            </p>

                                        </div>

                                    </div>

                                </div>

                                <div className="border-t border-slate-100 bg-slate-50 p-6">

                                    <img
                                        src={
                                            freelancer.skillSamplePhotoUrl
                                        }
                                        alt={`${skillName} sample`}
                                        className="
                                            max-h-[500px]
                                            w-full
                                            rounded-xl
                                            object-contain
                                        "
                                    />

                                </div>

                            </section>

                        )}

                    </div>

                    {/* =================================================
                        RIGHT
                    ================================================= */}

                    <aside className="space-y-8">

                        {/* Contact */}

                        <section
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                            "
                        >

                            <h2 className="font-semibold text-slate-900">
                                Contact
                            </h2>

                            <div className="mt-5 space-y-5">

                                <InfoItem
                                    icon={User}
                                    label="Name"
                                    value={
                                        displayName
                                    }
                                />

                                <InfoItem
                                    icon={User}
                                    label="Email"
                                    value={
                                        user?.email ??
                                        "Not provided"
                                    }
                                />

                                <InfoItem
                                    icon={User}
                                    label="Phone"
                                    value={
                                        user?.phoneNumber ??
                                        "Not provided"
                                    }
                                />

                                <InfoItem
                                    icon={
                                        User
                                    }
                                    label="Gender"
                                    value={
                                        user?.gender ??
                                        "Not provided"
                                    }
                                />

                            </div>

                        </section>

                        {/* Account */}

                        <section
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                            "
                        >

                            <h2 className="font-semibold text-slate-900">
                                Account
                            </h2>

                            <div className="mt-5 space-y-5">

                                <InfoItem
                                    icon={
                                        BadgeCheck
                                    }
                                    label="Verification"
                                    value={
                                        freelancer.isVerified
                                            ? "Verified"
                                            : "Not verified"
                                    }
                                />

                                <InfoItem
                                    icon={
                                        CalendarDays
                                    }
                                    label="Freelancer Profile Created"
                                    value={formatDate(
                                        freelancer.createdAt ??
                                        null
                                    )}
                                />

                                <InfoItem
                                    icon={
                                        CalendarDays
                                    }
                                    label="User Account Created"
                                    value={formatDate(
                                        user?.createdAt ??
                                        null
                                    )}
                                />

                                <InfoItem
                                    icon={
                                        Clock
                                    }
                                    label="Last Online"
                                    value={formatDateTime(
                                        user?.lastOnlineStatus ??
                                        null
                                    )}
                                />

                            </div>

                        </section>

                        {/* Location */}

                        <section
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                            "
                        >

                            <div className="flex items-center gap-3">

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-50
                                    "
                                >
                                    <MapPin className="h-5 w-5 text-blue-600" />
                                </div>

                                <div>

                                    <h2 className="font-semibold text-slate-900">
                                        Location
                                    </h2>

                                    <p className="text-xs text-slate-400">
                                        Latest freelancer location
                                    </p>

                                </div>

                            </div>

                            <div className="mt-5 space-y-4">

                                <div className="flex justify-between gap-4">

                                    <span className="text-sm text-slate-400">
                                        Latitude
                                    </span>

                                    <span className="text-sm font-medium text-slate-700">
                                        {freelancer.latitude ??
                                            "—"}
                                    </span>

                                </div>

                                <div className="flex justify-between gap-4">

                                    <span className="text-sm text-slate-400">
                                        Longitude
                                    </span>

                                    <span className="text-sm font-medium text-slate-700">
                                        {freelancer.longitude ??
                                            "—"}
                                    </span>

                                </div>

                                <div className="border-t border-slate-100 pt-4">

                                    <InfoItem
                                        icon={
                                            MapPin
                                        }
                                        label="Location Updated"
                                        value={formatDateTime(
                                            freelancer.updatedLocationAt ??
                                            null
                                        )}
                                    />

                                </div>

                            </div>

                        </section>

                        {/* Administrative state */}

                        {user &&
                            (
                                user.banned ||
                                user.isDeleted
                            ) && (

                                <section
                                    className="
                                        rounded-2xl
                                        border
                                        border-red-200
                                        bg-red-50
                                        p-6
                                    "
                                >

                                    <div className="flex items-center gap-3">

                                        <div
                                            className="
                                                flex
                                                h-10
                                                w-10
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-red-100
                                            "
                                        >
                                            <UserX className="h-5 w-5 text-red-600" />
                                        </div>

                                        <h2 className="font-semibold text-red-800">
                                            Account Status
                                        </h2>

                                    </div>

                                    <p className="mt-4 text-sm leading-6 text-red-700">

                                        {user.banned
                                            ? "This freelancer's user account is currently banned."
                                            : "This freelancer's user account has been deleted."}

                                    </p>

                                </section>

                            )}

                    </aside>

                </div>

                {/* =================================================
                    ADMIN ACTIONS
                ================================================= */}

                <section
                    className="
                        mt-8
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        shadow-sm
                    "
                >

                    <div className="flex items-center gap-3">

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-slate-100
                            "
                        >
                            <BadgeCheck className="h-5 w-5 text-slate-600" />
                        </div>

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Administrative Actions
                            </h2>

                            <p className="text-xs text-slate-400">
                                Freelancer management controls
                            </p>

                        </div>

                    </div>

                    <div
                        className="
                            mt-5
                            rounded-xl
                            border
                            border-dashed
                            border-slate-200
                            bg-slate-50
                            p-5
                        "
                    >

                        <p className="text-sm text-slate-500">
                            Administrative controls such as verification,
                            suspension, and account management will be added
                            here after the freelancer profile workflow is
                            complete.
                        </p>

                    </div>

                </section>

            </div>

        </main>
    );
}