// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useParams } from "next/navigation";
// import {
//     ArrowLeft,
//     CalendarDays,
//     CheckCircle2,
//     Clock3,
//     ExternalLink,
//     FileCheck2,
//     FileImage,
//     ShieldAlert,
//     ShieldCheck,
//     User,
//     XCircle,
// } from "lucide-react";

// import {
//     doc,
//     getDoc,
// } from "firebase/firestore";

// import { db } from "@/lib/firebase";

// type UserRecord = {
//     id: string;
//     firstName?: string;
//     middleName?: string;
//     lastName?: string;
//     name?: string;
//     email?: string;
//     phoneNumber?: string;
//     gender?: string;
//     about?: string;
//     profileImageUrl?: string;
//     isVerified?: boolean;
//     isAdmin?: boolean;
//     banned?: boolean;
//     isDeleted?: boolean;
//     status?: string;
//     skills?: string[];
// };

// type SkillMemberRecord = {
//     id: string;
//     skillSamplePhotoUrl?: string;
//     [key: string]: unknown;
// };

// type VerificationRecord = {
//     id: string;

//     verificationStatus?: string;

//     idNumber?: string;

//     reviewedBy?: string;

//     idImageUrl?: string;

//     fullName?: string;

//     additionalDocumentUrl?: string[];

//     freelancerId?: string;

//     reviewedAt?: Date | null;

//     skillId?: string;

//     selfieImageUrl?: string;

//     similarityScore?: number;

//     submittedAt?: Date | null;

//     livenessPassed?: boolean;
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
//         month: "long",
//         day: "numeric",
//         hour: "numeric",
//         minute: "2-digit",
//     });
// }

// function normalizeStatus(value?: string) {
//     return value?.trim().toLowerCase() ?? "unknown";
// }

// function StatusBadge({
//     status,
// }: {
//     status?: string;
// }) {
//     const normalized = normalizeStatus(status);

//     if (normalized === "approved") {
//         return (
//             <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700">
//                 <CheckCircle2 className="h-4 w-4" />
//                 Approved
//             </span>
//         );
//     }

//     if (normalized === "rejected") {
//         return (
//             <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700">
//                 <XCircle className="h-4 w-4" />
//                 Rejected
//             </span>
//         );
//     }

//     if (normalized === "pending") {
//         return (
//             <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-semibold text-orange-700">
//                 <Clock3 className="h-4 w-4" />
//                 Pending
//             </span>
//         );
//     }

//     return (
//         <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">
//             {status || "Unknown"}
//         </span>
//     );
// }

// function InfoItem({
//     label,
//     value,
// }: {
//     label: string;
//     value: string;
// }) {
//     return (
//         <div>
//             <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                 {label}
//             </p>

//             <p className="mt-1 break-words text-sm font-medium text-slate-800">
//                 {value}
//             </p>
//         </div>
//     );
// }

// function VerificationImage({
//     src,
//     alt,
//     title,
//     description,
// }: {
//     src?: string;
//     alt: string;
//     title: string;
//     description: string;
// }) {
//     return (
//         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
//             <div className="border-b border-slate-200 p-5">
//                 <div className="flex items-center gap-3">

//                     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
//                         <FileImage className="h-5 w-5 text-blue-600" />
//                     </div>

//                     <div>
//                         <h3 className="font-semibold text-slate-900">
//                             {title}
//                         </h3>

//                         <p className="text-xs text-slate-400">
//                             {description}
//                         </p>
//                     </div>

//                 </div>
//             </div>

//             <div className="bg-slate-100 p-4">
//                 {src ? (
//                     <a
//                         href={src}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="group block"
//                     >
//                         <div className="relative overflow-hidden rounded-xl bg-white">

//                             <img
//                                 src={src}
//                                 alt={alt}
//                                 className="max-h-[520px] w-full object-contain transition duration-200 group-hover:scale-[1.01]"
//                             />

//                             <div className="absolute right-3 top-3 flex items-center gap-2 rounded-lg bg-black/70 px-3 py-2 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
//                                 <ExternalLink className="h-3.5 w-3.5" />
//                                 Open full image
//                             </div>

//                         </div>
//                     </a>
//                 ) : (
//                     <div className="flex min-h-64 items-center justify-center rounded-xl bg-white text-sm text-slate-400">
//                         No image provided.
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// function getUserDisplayName(user: UserRecord | null) {
//     if (!user) {
//         return "Unknown Freelancer";
//     }

//     if (user.name) {
//         return user.name;
//     }

//     return [
//         user.firstName,
//         user.middleName,
//         user.lastName,
//     ]
//         .filter(Boolean)
//         .join(" ") || "Unknown Freelancer";
// }

// function formatSkillMemberValue(
//     value: unknown
// ): string {
//     if (value === null || value === undefined) {
//         return "—";
//     }

//     if (value instanceof Date) {
//         return formatDateTime(value);
//     }

//     if (
//         typeof value === "object" &&
//         value !== null &&
//         "toDate" in value &&
//         typeof (
//             value as {
//                 toDate?: unknown;
//             }
//         ).toDate === "function"
//     ) {
//         return formatDateTime(
//             getDate(value)
//         );
//     }

//     if (Array.isArray(value)) {
//         return value.join(", ");
//     }

//     if (typeof value === "object") {
//         return JSON.stringify(value);
//     }

//     return String(value);
// }

// export default function AdminVerificationDetailPage() {
//     const params = useParams();

//     const verificationId =
//         Array.isArray(params.verificationId)
//             ? params.verificationId[0]
//             : params.verificationId;

//     const [verification, setVerification] =
//         useState<VerificationRecord | null>(null);

//     const [user, setUser] =
//         useState<UserRecord | null>(null);

//     const [skillMember, setSkillMember] =
//         useState<SkillMemberRecord | null>(null);

//     const [loading, setLoading] =
//         useState(true);

//     const [error, setError] =
//         useState<string | null>(null);

//     useEffect(() => {
//         async function loadVerification() {
//             if (!verificationId) {
//                 setError(
//                     "Verification ID is missing."
//                 );

//                 setLoading(false);

//                 return;
//             }

//             try {
//                 setLoading(true);
//                 setError(null);

//                 /*
//                  * ---------------------------------------------------------
//                  * 1. Load FreelancerVerification
//                  * ---------------------------------------------------------
//                  */

//                 const verificationRef = doc(
//                     db,
//                     "FreelancerVerification",
//                     verificationId
//                 );

//                 const verificationSnapshot =
//                     await getDoc(
//                         verificationRef
//                     );

//                 if (!verificationSnapshot.exists()) {
//                     setError(
//                         "Verification request could not be found."
//                     );

//                     return;
//                 }

//                 const verificationData =
//                     verificationSnapshot.data();

//                 const verificationRecord:
//                     VerificationRecord = {
//                     id: verificationSnapshot.id,

//                     verificationStatus:
//                         typeof verificationData.verificationStatus ===
//                             "string"
//                             ? verificationData.verificationStatus
//                             : undefined,

//                     idNumber:
//                         typeof verificationData.idNumber ===
//                             "string"
//                             ? verificationData.idNumber
//                             : undefined,

//                     reviewedBy:
//                         typeof verificationData.reviewedBy ===
//                             "string"
//                             ? verificationData.reviewedBy
//                             : undefined,

//                     idImageUrl:
//                         typeof verificationData.idImageUrl ===
//                             "string"
//                             ? verificationData.idImageUrl
//                             : undefined,

//                     fullName:
//                         typeof verificationData.fullName ===
//                             "string"
//                             ? verificationData.fullName
//                             : undefined,

//                     additionalDocumentUrl:
//                         Array.isArray(
//                             verificationData.additionalDocumentUrl
//                         )
//                             ? verificationData.additionalDocumentUrl.filter(
//                                 (
//                                     value: unknown
//                                 ): value is string =>
//                                     typeof value ===
//                                     "string"
//                             )
//                             : [],

//                     freelancerId:
//                         typeof verificationData.freelancerId ===
//                             "string"
//                             ? verificationData.freelancerId
//                             : undefined,

//                     reviewedAt:
//                         getDate(
//                             verificationData.reviewedAt
//                         ),

//                     skillId:
//                         typeof verificationData.skillId ===
//                             "string"
//                             ? verificationData.skillId
//                             : undefined,

//                     selfieImageUrl:
//                         typeof verificationData.selfieImageUrl ===
//                             "string"
//                             ? verificationData.selfieImageUrl
//                             : undefined,

//                     similarityScore:
//                         typeof verificationData.similarityScore ===
//                             "number"
//                             ? verificationData.similarityScore
//                             : undefined,

//                     submittedAt:
//                         getDate(
//                             verificationData.submittedAt
//                         ),

//                     livenessPassed:
//                         typeof verificationData.livenessPassed ===
//                             "boolean"
//                             ? verificationData.livenessPassed
//                             : undefined,
//                 };

//                 setVerification(
//                     verificationRecord
//                 );

//                 /*
//                  * ---------------------------------------------------------
//                  * 2. Load Users/{freelancerId}
//                  * ---------------------------------------------------------
//                  */

//                 if (
//                     verificationRecord.freelancerId
//                 ) {
//                     const userRef = doc(
//                         db,
//                         "Users",
//                         verificationRecord.freelancerId
//                     );

//                     const userSnapshot =
//                         await getDoc(userRef);

//                     if (userSnapshot.exists()) {
//                         const userData =
//                             userSnapshot.data();

//                         setUser({
//                             id: userSnapshot.id,

//                             firstName:
//                                 userData.firstName,

//                             middleName:
//                                 userData.middleName,

//                             lastName:
//                                 userData.lastName,

//                             name:
//                                 userData.name,

//                             email:
//                                 userData.email,

//                             phoneNumber:
//                                 userData.phoneNumber,

//                             gender:
//                                 userData.gender,

//                             about:
//                                 userData.about,

//                             profileImageUrl:
//                                 userData.profileImageUrl,

//                             isVerified:
//                                 userData.isVerified,

//                             isAdmin:
//                                 userData.isAdmin,

//                             banned:
//                                 userData.banned,

//                             isDeleted:
//                                 userData.isDeleted,

//                             status:
//                                 userData.status,

//                             skills:
//                                 Array.isArray(
//                                     userData.skills
//                                 )
//                                     ? userData.skills
//                                     : undefined,
//                         });
//                     }
//                 }

//                 /*
//                  * ---------------------------------------------------------
//                  * 3. Load SkillMembers/{freelancerId}_{skillId}
//                  * ---------------------------------------------------------
//                  */

//                 if (
//                     verificationRecord.freelancerId &&
//                     verificationRecord.skillId
//                 ) {
//                     const skillMemberId =
//                         `${verificationRecord.freelancerId}_${verificationRecord.skillId}`;

//                     const skillMemberRef =
//                         doc(
//                             db,
//                             "SkillMembers",
//                             skillMemberId
//                         );

//                     const skillMemberSnapshot =
//                         await getDoc(
//                             skillMemberRef
//                         );

//                     if (
//                         skillMemberSnapshot.exists()
//                     ) {
//                         setSkillMember({
//                             id: skillMemberSnapshot.id,
//                             ...skillMemberSnapshot.data(),
//                         });
//                     }
//                 }
//             } catch (err) {
//                 console.error(
//                     "Failed to load verification:",
//                     err
//                 );

//                 setError(
//                     "Unable to load this verification request."
//                 );
//             } finally {
//                 setLoading(false);
//             }
//         }

//         loadVerification();
//     }, [verificationId]);

//     if (loading) {
//         return (
//             <main className="min-h-screen bg-slate-50">
//                 <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

//                     <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />

//                     <div className="mt-8 h-48 animate-pulse rounded-3xl bg-slate-200" />

//                     <div className="mt-8 grid gap-8 lg:grid-cols-2">
//                         <div className="h-[500px] animate-pulse rounded-2xl bg-slate-200" />
//                         <div className="h-[500px] animate-pulse rounded-2xl bg-slate-200" />
//                     </div>

//                 </div>
//             </main>
//         );
//     }

//     if (error || !verification) {
//         return (
//             <main className="min-h-screen bg-slate-50">

//                 <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

//                     <Link
//                         href="/admin/verifications"
//                         className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
//                     >
//                         <ArrowLeft className="h-4 w-4" />
//                         Back to Verification Requests
//                     </Link>

//                     <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

//                         <XCircle className="mx-auto h-10 w-10 text-red-400" />

//                         <h1 className="mt-4 text-lg font-semibold text-red-800">
//                             Unable to load verification
//                         </h1>

//                         <p className="mt-2 text-sm text-red-600">
//                             {error}
//                         </p>

//                     </div>

//                 </div>

//             </main>
//         );
//     }

//     const freelancerName =
//         getUserDisplayName(user);

//     const similarityPercentage =
//         verification.similarityScore !==
//             undefined
//             ? (
//                 verification.similarityScore *
//                 100
//             ).toFixed(1)
//             : null;

//     const skillMemberId =
//         verification.freelancerId &&
//             verification.skillId
//             ? `${verification.freelancerId}_${verification.skillId}`
//             : null;

//     /*
//      * Hide fields that we already display elsewhere.
//      * The remaining SkillMember fields are shown automatically,
//      * so we don't have to guess your SkillMember schema.
//      */

//     const skillMemberFields =
//         skillMember
//             ? Object.entries(
//                 skillMember
//             ).filter(
//                 ([key]) =>
//                     ![
//                         "id",
//                         "userId",
//                         "freelancerId",
//                         "skillId",
//                     ].includes(key)
//             )
//             : [];

//     return (
//         <main className="min-h-screen bg-slate-50">

//             {/* Header */}

//             <div className="border-b border-slate-200 bg-white">

//                 <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">

//                     <Link
//                         href="/admin/verifications"
//                         className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
//                     >
//                         <ArrowLeft className="h-4 w-4" />
//                         Back to Verification Requests
//                     </Link>

//                 </div>

//             </div>

//             <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

//                 {/* =====================================================
//                     Verification Header
//                 ====================================================== */}

//                 <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

//                     <div className="h-28 bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500" />

//                     <div className="px-6 pb-7 lg:px-8">

//                         <div className="-mt-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

//                             <div className="flex items-end gap-4">

//                                 {user?.profileImageUrl ? (
//                                     <img
//                                         src={
//                                             user.profileImageUrl
//                                         }
//                                         alt={
//                                             freelancerName
//                                         }
//                                         className="h-20 w-20 rounded-2xl border-4 border-white object-cover shadow-lg"
//                                     />
//                                 ) : (
//                                     <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-blue-100 shadow-lg">
//                                         <User className="h-9 w-9 text-blue-600" />
//                                     </div>
//                                 )}

//                                 <div className="pb-1">

//                                     <h1 className="text-2xl font-bold text-slate-900">
//                                         {freelancerName}
//                                     </h1>

//                                     <p className="mt-1 text-sm text-slate-400">
//                                         Freelancer Skill Verification
//                                     </p>

//                                 </div>

//                             </div>

//                             <div className="pb-1">
//                                 <StatusBadge
//                                     status={
//                                         verification.verificationStatus
//                                     }
//                                 />
//                             </div>

//                         </div>

//                     </div>

//                 </section>

//                 {/* =====================================================
//                     Summary Cards
//                 ====================================================== */}

//                 <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

//                     <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

//                         <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                             Skill
//                         </p>

//                         <p className="mt-2 text-lg font-bold text-slate-900">
//                             {verification.skillId ??
//                                 "—"}
//                         </p>

//                     </div>

//                     <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

//                         <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                             Face Similarity
//                         </p>

//                         <p className="mt-2 text-lg font-bold text-slate-900">
//                             {similarityPercentage
//                                 ? `${similarityPercentage}%`
//                                 : "—"}
//                         </p>

//                     </div>

//                     <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

//                         <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                             Liveness
//                         </p>

//                         <p
//                             className={`mt-2 text-lg font-bold ${verification.livenessPassed ===
//                                 true
//                                 ? "text-green-600"
//                                 : verification.livenessPassed ===
//                                     false
//                                     ? "text-red-600"
//                                     : "text-slate-900"
//                                 }`}
//                         >
//                             {verification.livenessPassed ===
//                                 true
//                                 ? "Passed"
//                                 : verification.livenessPassed ===
//                                     false
//                                     ? "Failed"
//                                     : "Not available"}
//                         </p>

//                     </div>

//                     <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

//                         <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                             Submitted
//                         </p>

//                         <p className="mt-2 text-sm font-bold text-slate-900">
//                             {formatDate(
//                                 verification.submittedAt ??
//                                 null
//                             )}
//                         </p>

//                     </div>

//                 </div>

//                 {/* =====================================================
//                     Liveness Warning
//                 ====================================================== */}

//                 {verification.livenessPassed ===
//                     false && (
//                         <div className="mt-6 flex items-start gap-4 rounded-2xl border border-orange-200 bg-orange-50 p-5">

//                             <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-100">
//                                 <ShieldAlert className="h-5 w-5 text-orange-600" />
//                             </div>

//                             <div>

//                                 <h2 className="font-semibold text-orange-800">
//                                     Liveness check did not pass
//                                 </h2>

//                                 <p className="mt-1 text-sm leading-6 text-orange-700">
//                                     The stored verification result indicates
//                                     that the liveness check was not passed.
//                                     Review the submitted documents and selfie
//                                     before making an administrative decision.
//                                 </p>

//                             </div>

//                         </div>
//                     )}

//                 {/* =====================================================
//                     Freelancer Information
//                 ====================================================== */}

//                 <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

//                     <div className="flex items-center gap-3">

//                         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
//                             <User className="h-5 w-5 text-blue-600" />
//                         </div>

//                         <div>

//                             <h2 className="font-semibold text-slate-900">
//                                 Freelancer
//                             </h2>

//                             <p className="text-xs text-slate-400">
//                                 User account associated with this skill verification
//                             </p>

//                         </div>

//                     </div>

//                     {user ? (
//                         <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

//                             <InfoItem
//                                 label="Full Name"
//                                 value={
//                                     freelancerName
//                                 }
//                             />

//                             <InfoItem
//                                 label="Email"
//                                 value={
//                                     user.email ??
//                                     "—"
//                                 }
//                             />

//                             <InfoItem
//                                 label="Phone"
//                                 value={
//                                     user.phoneNumber ??
//                                     "—"
//                                 }
//                             />

//                             <InfoItem
//                                 label="Gender"
//                                 value={
//                                     user.gender ??
//                                     "—"
//                                 }
//                             />

//                             <InfoItem
//                                 label="User ID"
//                                 value={
//                                     user.id
//                                 }
//                             />

//                             <InfoItem
//                                 label="Account Status"
//                                 value={
//                                     user.isDeleted
//                                         ? "Deleted"
//                                         : user.banned
//                                             ? "Banned"
//                                             : user.status ??
//                                             "Active"
//                                 }
//                             />

//                             <InfoItem
//                                 label="NARP Verified"
//                                 value={
//                                     user.isVerified
//                                         ? "Yes"
//                                         : "No"
//                                 }
//                             />

//                             <InfoItem
//                                 label="Admin"
//                                 value={
//                                     user.isAdmin
//                                         ? "Yes"
//                                         : "No"
//                                 }
//                             />

//                             <InfoItem
//                                 label="Skills"
//                                 value={
//                                     user.skills?.join(
//                                         ", "
//                                     ) ??
//                                     "—"
//                                 }
//                             />

//                         </div>
//                     ) : (
//                         <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-5">

//                             <p className="font-semibold text-orange-800">
//                                 User record not found
//                             </p>

//                             <p className="mt-1 text-sm text-orange-700">
//                                 The verification exists, but the
//                                 corresponding Users document could not
//                                 be loaded.
//                             </p>

//                             <p className="mt-3 break-all font-mono text-xs text-orange-600">
//                                 User ID:{" "}
//                                 {
//                                     verification.freelancerId
//                                 }
//                             </p>

//                         </div>
//                     )}

//                 </section>

//                 {/* =====================================================
//                     SkillMember
//                 ====================================================== */}

//                 <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

//                     <div className="flex items-center gap-3">

//                         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
//                             <ShieldCheck className="h-5 w-5 text-blue-600" />
//                         </div>

//                         <div>

//                             <h2 className="font-semibold text-slate-900">
//                                 Skill Membership
//                             </h2>

//                             <p className="text-xs text-slate-400">
//                                 SkillMember record associated with this verification
//                             </p>

//                         </div>

//                     </div>

//                     <div className="mt-6">

//                         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

//                             <InfoItem
//                                 label="Skill"
//                                 value={
//                                     verification.skillId ??
//                                     "—"
//                                 }
//                             />

//                             <InfoItem
//                                 label="SkillMember ID"
//                                 value={
//                                     skillMemberId ??
//                                     "—"
//                                 }
//                             />

//                             <InfoItem
//                                 label="Freelancer ID"
//                                 value={
//                                     verification.freelancerId ??
//                                     "—"
//                                 }
//                             />

//                         </div>

//                         {skillMember ? (
//                             <>
//                                 {skillMemberFields.length >
//                                     0 && (
//                                         <div className="mt-8 border-t border-slate-200 pt-6">

//                                             <h3 className="text-sm font-semibold text-slate-900">
//                                                 SkillMember Details
//                                             </h3>

//                                             <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

//                                                 {skillMemberFields.map(
//                                                     ([
//                                                         key,
//                                                         value,
//                                                     ]) => (
//                                                         <InfoItem
//                                                             key={
//                                                                 key
//                                                             }
//                                                             label={key}
//                                                             value={formatSkillMemberValue(
//                                                                 value
//                                                             )}
//                                                         />
//                                                     )
//                                                 )}

//                                             </div>

//                                         </div>
//                                     )}
//                             </>
//                         ) : (
//                             <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">

//                                 <p className="font-semibold text-slate-700">
//                                     SkillMember record not found
//                                 </p>

//                                 <p className="mt-1 text-sm text-slate-500">
//                                     The verification request exists,
//                                     but a SkillMember document was not
//                                     found using the expected ID.
//                                 </p>

//                                 <p className="mt-3 break-all font-mono text-xs text-slate-400">
//                                     Expected ID:{" "}
//                                     {skillMemberId ??
//                                         "Unable to determine"}
//                                 </p>

//                             </div>
//                         )}

//                     </div>

//                 </section>

//                 {/* =====================================================
//     Skill Sample
// ====================================================== */}

//                 {typeof skillMember?.skillSamplePhotoUrl === "string" &&
//                     skillMember.skillSamplePhotoUrl && (
//                         <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

//                             <div className="flex items-center gap-3">

//                                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
//                                     <FileImage className="h-5 w-5 text-blue-600" />
//                                 </div>

//                                 <div>
//                                     <h2 className="font-semibold text-slate-900">
//                                         Skill Sample
//                                     </h2>

//                                     <p className="text-xs text-slate-400">
//                                         Sample work submitted for the{" "}
//                                         {verification.skillId ?? "skill"} skill
//                                     </p>
//                                 </div>

//                             </div>

//                             <div className="mt-6 overflow-hidden rounded-2xl bg-slate-100 p-4">

//                                 <a
//                                     href={skillMember.skillSamplePhotoUrl}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="group relative block overflow-hidden rounded-xl bg-white"
//                                 >
//                                     <img
//                                         src={skillMember.skillSamplePhotoUrl}
//                                         alt={`${verification.skillId ?? "Skill"} sample`}
//                                         className="
//                             mx-auto
//                             max-h-[650px]
//                             w-full
//                             object-contain
//                             transition
//                             duration-200
//                             group-hover:scale-[1.01]
//                         "
//                                     />

//                                     <div
//                                         className="
//                             absolute
//                             right-4
//                             top-4
//                             flex
//                             items-center
//                             gap-2
//                             rounded-lg
//                             bg-black/70
//                             px-3
//                             py-2
//                             text-xs
//                             font-semibold
//                             text-white
//                             opacity-0
//                             transition
//                             group-hover:opacity-100
//                         "
//                                     >
//                                         <ExternalLink className="h-3.5 w-3.5" />
//                                         Open full image
//                                     </div>

//                                 </a>

//                             </div>

//                         </section>
//                     )}

//                 {/* =====================================================
//                     Verification Information
//                 ====================================================== */}

//                 <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

//                     <div className="flex items-center gap-3">

//                         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
//                             <FileCheck2 className="h-5 w-5 text-blue-600" />
//                         </div>

//                         <div>

//                             <h2 className="font-semibold text-slate-900">
//                                 Verification Information
//                             </h2>

//                             <p className="text-xs text-slate-400">
//                                 Details submitted for this skill verification
//                             </p>

//                         </div>

//                     </div>

//                     <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

//                         <InfoItem
//                             label="Full Name"
//                             value={
//                                 verification.fullName ??
//                                 freelancerName
//                             }
//                         />

//                         <InfoItem
//                             label="Freelancer ID"
//                             value={
//                                 verification.freelancerId ??
//                                 "—"
//                             }
//                         />

//                         <InfoItem
//                             label="Skill"
//                             value={
//                                 verification.skillId ??
//                                 "—"
//                             }
//                         />

//                         <InfoItem
//                             label="ID Number"
//                             value={
//                                 verification.idNumber ||
//                                 "Not provided"
//                             }
//                         />

//                         <InfoItem
//                             label="Verification Status"
//                             value={
//                                 verification.verificationStatus ??
//                                 "—"
//                             }
//                         />

//                         <InfoItem
//                             label="Verification ID"
//                             value={
//                                 verification.id
//                             }
//                         />

//                     </div>

//                 </section>

//                 {/* =====================================================
//                     Documents
//                 ====================================================== */}

//                 <div className="mt-8 grid gap-8 lg:grid-cols-2">

//                     <VerificationImage
//                         src={
//                             verification.idImageUrl
//                         }
//                         alt="Government ID"
//                         title="Identification Document"
//                         description="Submitted government-issued identification"
//                     />

//                     <VerificationImage
//                         src={
//                             verification.selfieImageUrl
//                         }
//                         alt="Freelancer selfie"
//                         title="Selfie"
//                         description="Selfie submitted during verification"
//                     />

//                 </div>

//                 {/* =====================================================
//                     Additional Documents
//                 ====================================================== */}

//                 <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

//                     <div className="flex items-center gap-3">

//                         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
//                             <FileImage className="h-5 w-5 text-blue-600" />
//                         </div>

//                         <div>

//                             <h2 className="font-semibold text-slate-900">
//                                 Additional Documents
//                             </h2>

//                             <p className="text-xs text-slate-400">
//                                 Supporting documents submitted by the freelancer
//                             </p>

//                         </div>

//                     </div>

//                     {verification.additionalDocumentUrl &&
//                         verification.additionalDocumentUrl.length >
//                         0 ? (
//                         <div className="mt-6 grid gap-6 md:grid-cols-2">

//                             {verification.additionalDocumentUrl.map(
//                                 (
//                                     url,
//                                     index
//                                 ) => (
//                                     <VerificationImage
//                                         key={
//                                             url
//                                         }
//                                         src={
//                                             url
//                                         }
//                                         alt={`Additional verification document ${index + 1}`}
//                                         title={`Additional Document ${index + 1}`}
//                                         description="Supporting verification document"
//                                     />
//                                 )
//                             )}

//                         </div>
//                     ) : (
//                         <div className="mt-6 rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-400">
//                             No additional documents were submitted.
//                         </div>
//                     )}

//                 </section>

//                 {/* =====================================================
//                     Identity Verification Results
//                 ====================================================== */}

//                 <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

//                     <div className="flex items-center gap-3">

//                         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
//                             <ShieldCheck className="h-5 w-5 text-blue-600" />
//                         </div>

//                         <div>

//                             <h2 className="font-semibold text-slate-900">
//                                 Identity Verification Results
//                             </h2>

//                             <p className="text-xs text-slate-400">
//                                 Automated verification results stored with the request
//                             </p>

//                         </div>

//                     </div>

//                     <div className="mt-6 grid gap-6 sm:grid-cols-2">

//                         <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

//                             <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                                 Face Similarity Score
//                             </p>

//                             <div className="mt-3 flex items-end gap-2">

//                                 <span className="text-3xl font-bold text-slate-900">
//                                     {similarityPercentage ??
//                                         "—"}
//                                 </span>

//                                 {similarityPercentage && (
//                                     <span className="mb-1 text-sm font-medium text-slate-500">
//                                         %
//                                     </span>
//                                 )}

//                             </div>

//                             {verification.similarityScore !==
//                                 undefined && (
//                                     <div className="mt-4">

//                                         <div className="h-2 overflow-hidden rounded-full bg-slate-200">

//                                             <div
//                                                 className="h-full rounded-full bg-blue-600"
//                                                 style={{
//                                                     width: `${Math.min(
//                                                         Math.max(
//                                                             verification.similarityScore *
//                                                             100,
//                                                             0
//                                                         ),
//                                                         100
//                                                     )}%`,
//                                                 }}
//                                             />

//                                         </div>

//                                     </div>
//                                 )}

//                         </div>

//                         <div
//                             className={`rounded-xl border p-5 ${verification.livenessPassed ===
//                                 true
//                                 ? "border-green-200 bg-green-50"
//                                 : verification.livenessPassed ===
//                                     false
//                                     ? "border-red-200 bg-red-50"
//                                     : "border-slate-200 bg-slate-50"
//                                 }`}
//                         >

//                             <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                                 Liveness Check
//                             </p>

//                             <div className="mt-3 flex items-center gap-3">

//                                 {verification.livenessPassed ===
//                                     true ? (
//                                     <CheckCircle2 className="h-7 w-7 text-green-600" />
//                                 ) : verification.livenessPassed ===
//                                     false ? (
//                                     <XCircle className="h-7 w-7 text-red-600" />
//                                 ) : (
//                                     <Clock3 className="h-7 w-7 text-slate-400" />
//                                 )}

//                                 <span
//                                     className={`text-xl font-bold ${verification.livenessPassed ===
//                                         true
//                                         ? "text-green-700"
//                                         : verification.livenessPassed ===
//                                             false
//                                             ? "text-red-700"
//                                             : "text-slate-700"
//                                         }`}
//                                 >
//                                     {verification.livenessPassed ===
//                                         true
//                                         ? "Passed"
//                                         : verification.livenessPassed ===
//                                             false
//                                             ? "Failed"
//                                             : "Not available"}
//                                 </span>

//                             </div>

//                         </div>

//                     </div>

//                 </section>

//                 {/* =====================================================
//                     Review Information
//                 ====================================================== */}

//                 <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

//                     <div className="flex items-center gap-3">

//                         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
//                             <CalendarDays className="h-5 w-5 text-blue-600" />
//                         </div>

//                         <div>

//                             <h2 className="font-semibold text-slate-900">
//                                 Review Information
//                             </h2>

//                             <p className="text-xs text-slate-400">
//                                 Administrative review history
//                             </p>

//                         </div>

//                     </div>

//                     <div className="mt-6 grid gap-6 sm:grid-cols-2">

//                         <InfoItem
//                             label="Submitted At"
//                             value={formatDateTime(
//                                 verification.submittedAt ??
//                                 null
//                             )}
//                         />

//                         <InfoItem
//                             label="Reviewed At"
//                             value={formatDateTime(
//                                 verification.reviewedAt ??
//                                 null
//                             )}
//                         />

//                         <InfoItem
//                             label="Reviewed By"
//                             value={
//                                 verification.reviewedBy ??
//                                 "Not reviewed"
//                             }
//                         />

//                         <InfoItem
//                             label="Current Status"
//                             value={
//                                 verification.verificationStatus ??
//                                 "—"
//                             }
//                         />

//                     </div>

//                 </section>

//                 {/* =====================================================
//                     Administrative Actions
//                 ====================================================== */}

//                 <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

//                     <div className="flex items-center gap-3">

//                         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
//                             <ShieldCheck className="h-5 w-5 text-slate-600" />
//                         </div>

//                         <div>

//                             <h2 className="font-semibold text-slate-900">
//                                 Administrative Actions
//                             </h2>

//                             <p className="text-xs text-slate-400">
//                                 Approval and rejection actions will be connected next.
//                             </p>

//                         </div>

//                     </div>

//                     <div className="mt-5 flex flex-wrap gap-3">

//                         <button
//                             type="button"
//                             disabled
//                             className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white opacity-50"
//                         >
//                             <CheckCircle2 className="h-4 w-4" />
//                             Approve Verification
//                         </button>

//                         <button
//                             type="button"
//                             disabled
//                             className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 opacity-50"
//                         >
//                             <XCircle className="h-4 w-4" />
//                             Reject Verification
//                         </button>

//                     </div>

//                 </section>

//             </div>

//         </main>
//     );
// }




"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    ExternalLink,
    FileCheck2,
    FileImage,
    ShieldAlert,
    ShieldCheck,
    User,
    XCircle,
} from "lucide-react";

import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    where,
    writeBatch,
} from "firebase/firestore";

import { db, auth } from "@/lib/firebase";

type UserRecord = {
    id: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    name?: string;
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
    skills?: string[];
};

type SkillMemberRecord = {
    id: string;
    skillSamplePhotoUrl?: string;
    [key: string]: unknown;
};

type VerificationRecord = {
    id: string;
    verificationStatus?: string;
    idNumber?: string;
    reviewedBy?: string;
    idImageUrl?: string;
    fullName?: string;
    additionalDocumentUrl?: string[];
    freelancerId?: string;
    reviewedAt?: Date | null;
    skillId?: string;
    selfieImageUrl?: string;
    similarityScore?: number;
    submittedAt?: Date | null;
    livenessPassed?: boolean;
};

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

function formatDate(date: Date | null) {
    if (!date) {
        return "—";
    }

    return date.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function formatDateTime(date: Date | null) {
    if (!date) {
        return "—";
    }

    return date.toLocaleString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

function normalizeStatus(value?: string) {
    return value?.trim().toLowerCase() ?? "unknown";
}

function StatusBadge({
    status,
}: {
    status?: string;
}) {
    const normalized = normalizeStatus(status);

    if (normalized === "approved") {
        return (
            <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                Approved
            </span>
        );
    }

    if (normalized === "rejected") {
        return (
            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700">
                <XCircle className="h-4 w-4" />
                Rejected
            </span>
        );
    }

    if (normalized === "pending") {
        return (
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-semibold text-orange-700">
                <Clock3 className="h-4 w-4" />
                Pending
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">
            {status || "Unknown"}
        </span>
    );
}

function InfoItem({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-1 break-words text-sm font-medium text-slate-800">
                {value}
            </p>
        </div>
    );
}

function VerificationImage({
    src,
    alt,
    title,
    description,
}: {
    src?: string;
    alt: string;
    title: string;
    description: string;
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-5">
                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                        <FileImage className="h-5 w-5 text-blue-600" />
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900">
                            {title}
                        </h3>

                        <p className="text-xs text-slate-400">
                            {description}
                        </p>
                    </div>

                </div>
            </div>

            <div className="bg-slate-100 p-4">
                {src ? (
                    <a
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block"
                    >
                        <div className="relative overflow-hidden rounded-xl bg-white">

                            <img
                                src={src}
                                alt={alt}
                                className="max-h-[520px] w-full object-contain transition duration-200 group-hover:scale-[1.01]"
                            />

                            <div className="absolute right-3 top-3 flex items-center gap-2 rounded-lg bg-black/70 px-3 py-2 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
                                <ExternalLink className="h-3.5 w-3.5" />
                                Open full image
                            </div>

                        </div>
                    </a>
                ) : (
                    <div className="flex min-h-64 items-center justify-center rounded-xl bg-white text-sm text-slate-400">
                        No image provided.
                    </div>
                )}
            </div>
        </div>
    );
}

function getUserDisplayName(user: UserRecord | null) {
    if (!user) {
        return "Unknown Freelancer";
    }

    if (user.name) {
        return user.name;
    }

    return [
        user.firstName,
        user.middleName,
        user.lastName,
    ]
        .filter(Boolean)
        .join(" ") || "Unknown Freelancer";
}

function formatSkillMemberValue(value: unknown): string {
    if (value === null || value === undefined) {
        return "—";
    }

    if (value instanceof Date) {
        return formatDateTime(value);
    }

    if (
        typeof value === "object" &&
        value !== null &&
        "toDate" in value &&
        typeof (
            value as {
                toDate?: unknown;
            }
        ).toDate === "function"
    ) {
        return formatDateTime(getDate(value));
    }

    if (Array.isArray(value)) {
        return value.join(", ");
    }

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return String(value);
}

export default function AdminVerificationDetailPage() {
    const params = useParams();
    const router = useRouter();

    const verificationId =
        Array.isArray(params.verificationId)
            ? params.verificationId[0]
            : params.verificationId;

    const [verification, setVerification] =
        useState<VerificationRecord | null>(null);

    const [user, setUser] =
        useState<UserRecord | null>(null);

    const [skillMember, setSkillMember] =
        useState<SkillMemberRecord | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [actionLoading, setActionLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        async function loadVerification() {
            if (!verificationId) {
                setError(
                    "Verification ID is missing."
                );

                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                /*
                 * =========================================================
                 * 1. FreelancerVerification
                 * =========================================================
                 */

                const verificationRef = doc(
                    db,
                    "FreelancerVerification",
                    verificationId
                );

                const verificationSnapshot =
                    await getDoc(verificationRef);

                if (!verificationSnapshot.exists()) {
                    setError(
                        "Verification request could not be found."
                    );

                    return;
                }

                const verificationData =
                    verificationSnapshot.data();

                const verificationRecord:
                    VerificationRecord = {
                    id: verificationSnapshot.id,

                    verificationStatus:
                        typeof verificationData.verificationStatus ===
                            "string"
                            ? verificationData.verificationStatus
                            : undefined,

                    idNumber:
                        typeof verificationData.idNumber ===
                            "string"
                            ? verificationData.idNumber
                            : undefined,

                    reviewedBy:
                        typeof verificationData.reviewedBy ===
                            "string"
                            ? verificationData.reviewedBy
                            : undefined,

                    idImageUrl:
                        typeof verificationData.idImageUrl ===
                            "string"
                            ? verificationData.idImageUrl
                            : undefined,

                    fullName:
                        typeof verificationData.fullName ===
                            "string"
                            ? verificationData.fullName
                            : undefined,

                    additionalDocumentUrl:
                        Array.isArray(
                            verificationData.additionalDocumentUrl
                        )
                            ? verificationData.additionalDocumentUrl.filter(
                                (
                                    value: unknown
                                ): value is string =>
                                    typeof value ===
                                    "string"
                            )
                            : [],

                    freelancerId:
                        typeof verificationData.freelancerId ===
                            "string"
                            ? verificationData.freelancerId
                            : undefined,

                    reviewedAt:
                        getDate(
                            verificationData.reviewedAt
                        ),

                    skillId:
                        typeof verificationData.skillId ===
                            "string"
                            ? verificationData.skillId
                            : undefined,

                    selfieImageUrl:
                        typeof verificationData.selfieImageUrl ===
                            "string"
                            ? verificationData.selfieImageUrl
                            : undefined,

                    similarityScore:
                        typeof verificationData.similarityScore ===
                            "number"
                            ? verificationData.similarityScore
                            : undefined,

                    submittedAt:
                        getDate(
                            verificationData.submittedAt
                        ),

                    livenessPassed:
                        typeof verificationData.livenessPassed ===
                            "boolean"
                            ? verificationData.livenessPassed
                            : undefined,
                };

                setVerification(
                    verificationRecord
                );

                /*
                 * =========================================================
                 * 2. Users/{freelancerId}
                 * =========================================================
                 */

                if (
                    verificationRecord.freelancerId
                ) {
                    const userRef = doc(
                        db,
                        "Users",
                        verificationRecord.freelancerId
                    );

                    const userSnapshot =
                        await getDoc(userRef);

                    if (userSnapshot.exists()) {
                        const userData =
                            userSnapshot.data();

                        setUser({
                            id: userSnapshot.id,
                            firstName:
                                userData.firstName,
                            middleName:
                                userData.middleName,
                            lastName:
                                userData.lastName,
                            name:
                                userData.name,
                            email:
                                userData.email,
                            phoneNumber:
                                userData.phoneNumber,
                            gender:
                                userData.gender,
                            about:
                                userData.about,
                            profileImageUrl:
                                userData.profileImageUrl,
                            isVerified:
                                userData.isVerified,
                            isAdmin:
                                userData.isAdmin,
                            banned:
                                userData.banned,
                            isDeleted:
                                userData.isDeleted,
                            status:
                                userData.status,
                            skills:
                                Array.isArray(
                                    userData.skills
                                )
                                    ? userData.skills
                                    : undefined,
                        });
                    }
                }

                /*
                 * =========================================================
                 * 3. SkillMembers/{freelancerId}_{skillId}
                 * =========================================================
                 */

                if (
                    verificationRecord.freelancerId &&
                    verificationRecord.skillId
                ) {
                    const skillMemberId =
                        `${verificationRecord.freelancerId}_${verificationRecord.skillId}`;

                    const skillMemberRef =
                        doc(
                            db,
                            "SkillMembers",
                            skillMemberId
                        );

                    const skillMemberSnapshot =
                        await getDoc(
                            skillMemberRef
                        );

                    if (
                        skillMemberSnapshot.exists()
                    ) {
                        setSkillMember({
                            id: skillMemberSnapshot.id,
                            ...skillMemberSnapshot.data(),
                        });
                    }
                }
            } catch (err) {
                console.error(
                    "Failed to load verification:",
                    err
                );

                setError(
                    "Unable to load this verification request."
                );
            } finally {
                setLoading(false);
            }
        }

        loadVerification();
    }, [verificationId]);

    /*
     * =========================================================
     * APPROVE VERIFICATION
     * =========================================================
     *
     * This mirrors the Flutter app:
     *
     * 1. FreelancerVerification -> approved
     * 2. SkillMembers -> isVerified = true
     * 3. UserSkills -> verificationStatus = approved
     */

    const handleApprove = async () => {
        if (
            !verification ||
            !skillMember
        ) {
            alert(
                "Required verification or SkillMember data is missing."
            );

            return;
        }

        if (
            normalizeStatus(
                verification.verificationStatus
            ) !== "pending"
        ) {
            alert(
                "This verification request is no longer pending."
            );

            return;
        }

        const adminUid =
            auth.currentUser?.uid;

        if (!adminUid) {
            alert(
                "You must be signed in as an admin."
            );

            return;
        }

        if (
            !verification.freelancerId ||
            !verification.skillId
        ) {
            alert(
                "Freelancer ID or Skill ID is missing."
            );

            return;
        }

        const confirmed =
            window.confirm(
                `Approve ${getUserDisplayName(
                    user
                )}'s ${verification.skillId} verification?`
            );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(true);

            /*
             * Create one batch.
             */

            const batch = writeBatch(db);

            /*
             * ---------------------------------------------------------
             * 1. FreelancerVerification
             * ---------------------------------------------------------
             */

            batch.update(
                doc(
                    db,
                    "FreelancerVerification",
                    verification.id
                ),
                {
                    verificationStatus:
                        "approved",

                    reviewedAt:
                        serverTimestamp(),

                    reviewedBy:
                        adminUid,
                }
            );

            /*
             * ---------------------------------------------------------
             * 2. SkillMembers
             * ---------------------------------------------------------
             */

            batch.update(
                doc(
                    db,
                    "SkillMembers",
                    skillMember.id
                ),
                {
                    isVerified: true,
                }
            );

            /*
             * ---------------------------------------------------------
             * 3. UserSkills
             * ---------------------------------------------------------
             */

            const userSkillsQuery =
                query(
                    collection(
                        db,
                        "UserSkills"
                    ),
                    where(
                        "userId",
                        "==",
                        verification.freelancerId
                    ),
                    where(
                        "skillId",
                        "==",
                        verification.skillId
                    )
                );

            const userSkillsSnapshot =
                await getDocs(
                    userSkillsQuery
                );

            for (
                const userSkillDoc of
                userSkillsSnapshot.docs
            ) {
                batch.update(
                    userSkillDoc.ref,
                    {
                        verificationStatus:
                            "approved",

                        approvedAt:
                            serverTimestamp(),

                        approvedBy:
                            adminUid,
                    }
                );
            }

            /*
             * ---------------------------------------------------------
             * Commit all changes together.
             * ---------------------------------------------------------
             */

            await batch.commit();

            /*
             * Go back to pending verification list.
             */

            router.push(
                "/admin/verifications"
            );
            router.refresh();
        } catch (err) {
            console.error(
                "Failed to approve verification:",
                err
            );

            alert(
                "Failed to approve verification. Please try again."
            );
        } finally {
            setActionLoading(false);
        }
    };

    /*
     * =========================================================
     * REJECT VERIFICATION
     * =========================================================
     */

    const handleReject = async () => {
        if (!verification) {
            return;
        }

        if (
            normalizeStatus(
                verification.verificationStatus
            ) !== "pending"
        ) {
            alert(
                "This verification request is no longer pending."
            );

            return;
        }

        const adminUid =
            auth.currentUser?.uid;

        if (!adminUid) {
            alert(
                "You must be signed in as an admin."
            );

            return;
        }

        const confirmed =
            window.confirm(
                `Reject ${getUserDisplayName(
                    user
                )}'s ${verification.skillId ?? "skill"} verification?`
            );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(true);

            /*
             * Rejection only changes the verification request.
             *
             * We intentionally do NOT change:
             *
             * SkillMembers.isVerified
             *
             * because an existing verified SkillMember should
             * not automatically become unverified because of
             * a rejected verification request.
             */

            const batch = writeBatch(db);

            batch.update(
                doc(
                    db,
                    "FreelancerVerification",
                    verification.id
                ),
                {
                    verificationStatus:
                        "rejected",

                    reviewedAt:
                        serverTimestamp(),

                    reviewedBy:
                        adminUid,
                }
            );

            await batch.commit();

            router.push(
                "/admin/verifications"
            );
            router.refresh();
        } catch (err) {
            console.error(
                "Failed to reject verification:",
                err
            );

            alert(
                "Failed to reject verification. Please try again."
            );
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

                    <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />

                    <div className="mt-8 h-48 animate-pulse rounded-3xl bg-slate-200" />

                    <div className="mt-8 grid gap-8 lg:grid-cols-2">

                        <div className="h-[500px] animate-pulse rounded-2xl bg-slate-200" />

                        <div className="h-[500px] animate-pulse rounded-2xl bg-slate-200" />

                    </div>

                </div>
            </main>
        );
    }

    if (error || !verification) {
        return (
            <main className="min-h-screen bg-slate-50">

                <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

                    <Link
                        href="/admin/verifications"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Verification Requests
                    </Link>

                    <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

                        <XCircle className="mx-auto h-10 w-10 text-red-400" />

                        <h1 className="mt-4 text-lg font-semibold text-red-800">
                            Unable to load verification
                        </h1>

                        <p className="mt-2 text-sm text-red-600">
                            {error}
                        </p>

                    </div>

                </div>

            </main>
        );
    }

    const freelancerName =
        getUserDisplayName(user);

    const similarityPercentage =
        verification.similarityScore !==
            undefined
            ? (
                verification.similarityScore *
                100
            ).toFixed(1)
            : null;

    const skillMemberId =
        verification.freelancerId &&
            verification.skillId
            ? `${verification.freelancerId}_${verification.skillId}`
            : null;

    const skillMemberFields =
        skillMember
            ? Object.entries(
                skillMember
            ).filter(
                ([key]) =>
                    ![
                        "id",
                        "userId",
                        "freelancerId",
                        "skillId",
                        "skillSamplePhotoUrl",
                        "profileImageUrl",
                    ].includes(key)
            )
            : [];

    const isPending =
        normalizeStatus(
            verification.verificationStatus
        ) === "pending";

    return (
        <main className="min-h-screen bg-slate-50">

            {/* Header */}

            <div className="border-b border-slate-200 bg-white">

                <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">

                    <Link
                        href="/admin/verifications"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Verification Requests
                    </Link>

                </div>

            </div>

            <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

                {/* =====================================================
                    Verification Header
                ====================================================== */}

                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                    <div className="h-28 bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500" />

                    <div className="px-6 pb-7 lg:px-8">

                        <div className="-mt-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                            <div className="flex items-end gap-4">

                                {user?.profileImageUrl ? (
                                    <img
                                        src={
                                            user.profileImageUrl
                                        }
                                        alt={
                                            freelancerName
                                        }
                                        className="h-20 w-20 rounded-2xl border-4 border-white object-cover shadow-lg"
                                    />
                                ) : (
                                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-blue-100 shadow-lg">
                                        <User className="h-9 w-9 text-blue-600" />
                                    </div>
                                )}

                                <div className="pb-1">

                                    <h1 className="text-2xl font-bold text-slate-900">
                                        {freelancerName}
                                    </h1>

                                    <p className="mt-1 text-sm text-slate-400">
                                        Freelancer Skill Verification
                                    </p>

                                </div>

                            </div>

                            <div className="pb-1">

                                <StatusBadge
                                    status={
                                        verification.verificationStatus
                                    }
                                />

                            </div>

                        </div>

                    </div>

                </section>

                {/* =====================================================
                    Summary Cards
                ====================================================== */}

                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Skill
                        </p>

                        <p className="mt-2 text-lg font-bold text-slate-900">
                            {verification.skillId ??
                                "—"}
                        </p>

                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Face Similarity
                        </p>

                        <p className="mt-2 text-lg font-bold text-slate-900">
                            {similarityPercentage
                                ? `${similarityPercentage}%`
                                : "—"}
                        </p>

                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Liveness
                        </p>

                        <p
                            className={`mt-2 text-lg font-bold ${verification.livenessPassed ===
                                true
                                ? "text-green-600"
                                : verification.livenessPassed ===
                                    false
                                    ? "text-red-600"
                                    : "text-slate-900"
                                }`}
                        >
                            {verification.livenessPassed ===
                                true
                                ? "Passed"
                                : verification.livenessPassed ===
                                    false
                                    ? "Failed"
                                    : "Not available"}
                        </p>

                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Submitted
                        </p>

                        <p className="mt-2 text-sm font-bold text-slate-900">
                            {formatDate(
                                verification.submittedAt ??
                                null
                            )}
                        </p>

                    </div>

                </div>

                {/* =====================================================
                    Liveness Warning
                ====================================================== */}

                {verification.livenessPassed ===
                    false && (
                        <div className="mt-6 flex items-start gap-4 rounded-2xl border border-orange-200 bg-orange-50 p-5">

                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-100">
                                <ShieldAlert className="h-5 w-5 text-orange-600" />
                            </div>

                            <div>

                                <h2 className="font-semibold text-orange-800">
                                    Liveness check did not pass
                                </h2>

                                <p className="mt-1 text-sm leading-6 text-orange-700">
                                    The stored verification result indicates
                                    that the liveness check was not passed.
                                    Review the submitted documents and selfie
                                    before making an administrative decision.
                                </p>

                            </div>

                        </div>
                    )}

                {/* =====================================================
                    Freelancer Information
                ====================================================== */}

                <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                            <User className="h-5 w-5 text-blue-600" />
                        </div>

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Freelancer
                            </h2>

                            <p className="text-xs text-slate-400">
                                User account associated with this skill verification
                            </p>

                        </div>

                    </div>

                    {user ? (
                        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                            <InfoItem
                                label="Full Name"
                                value={
                                    freelancerName
                                }
                            />

                            <InfoItem
                                label="Email"
                                value={
                                    user.email ??
                                    "—"
                                }
                            />

                            <InfoItem
                                label="Phone"
                                value={
                                    user.phoneNumber ??
                                    "—"
                                }
                            />

                            <InfoItem
                                label="Gender"
                                value={
                                    user.gender ??
                                    "—"
                                }
                            />

                            <InfoItem
                                label="User ID"
                                value={
                                    user.id
                                }
                            />

                            <InfoItem
                                label="Account Status"
                                value={
                                    user.isDeleted
                                        ? "Deleted"
                                        : user.banned
                                            ? "Banned"
                                            : user.status ??
                                            "Active"
                                }
                            />

                            <InfoItem
                                label="NARP Verified"
                                value={
                                    user.isVerified
                                        ? "Yes"
                                        : "No"
                                }
                            />

                            <InfoItem
                                label="Admin"
                                value={
                                    user.isAdmin
                                        ? "Yes"
                                        : "No"
                                }
                            />

                            <InfoItem
                                label="Skills"
                                value={
                                    user.skills?.join(
                                        ", "
                                    ) ??
                                    "—"
                                }
                            />

                        </div>
                    ) : (
                        <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-5">

                            <p className="font-semibold text-orange-800">
                                User record not found
                            </p>

                            <p className="mt-1 text-sm text-orange-700">
                                The verification exists, but the
                                corresponding Users document could not
                                be loaded.
                            </p>

                            <p className="mt-3 break-all font-mono text-xs text-orange-600">
                                User ID:{" "}
                                {
                                    verification.freelancerId
                                }
                            </p>

                        </div>
                    )}

                </section>

                {/* =====================================================
                    SkillMember
                ====================================================== */}

                <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                            <ShieldCheck className="h-5 w-5 text-blue-600" />
                        </div>

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Skill Membership
                            </h2>

                            <p className="text-xs text-slate-400">
                                SkillMember record associated with this verification
                            </p>

                        </div>

                    </div>

                    <div className="mt-6">

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                            <InfoItem
                                label="Skill"
                                value={
                                    verification.skillId ??
                                    "—"
                                }
                            />

                            <InfoItem
                                label="SkillMember ID"
                                value={
                                    skillMemberId ??
                                    "—"
                                }
                            />

                            <InfoItem
                                label="Freelancer ID"
                                value={
                                    verification.freelancerId ??
                                    "—"
                                }
                            />

                        </div>

                        {skillMember ? (
                            <>
                                {skillMemberFields.length >
                                    0 && (
                                        <div className="mt-8 border-t border-slate-200 pt-6">

                                            <h3 className="text-sm font-semibold text-slate-900">
                                                SkillMember Details
                                            </h3>

                                            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                                                {skillMemberFields.map(
                                                    ([
                                                        key,
                                                        value,
                                                    ]) => (
                                                        <InfoItem
                                                            key={
                                                                key
                                                            }
                                                            label={key}
                                                            value={formatSkillMemberValue(
                                                                value
                                                            )}
                                                        />
                                                    )
                                                )}

                                            </div>

                                        </div>
                                    )}
                            </>
                        ) : (
                            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">

                                <p className="font-semibold text-slate-700">
                                    SkillMember record not found
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    The verification request exists,
                                    but a SkillMember document was not
                                    found using the expected ID.
                                </p>

                                <p className="mt-3 break-all font-mono text-xs text-slate-400">
                                    Expected ID:{" "}
                                    {skillMemberId ??
                                        "Unable to determine"}
                                </p>

                            </div>
                        )}

                    </div>

                </section>

                {/* =====================================================
                    Skill Sample
                ====================================================== */}

                {typeof skillMember?.skillSamplePhotoUrl ===
                    "string" &&
                    skillMember.skillSamplePhotoUrl && (
                        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                    <FileImage className="h-5 w-5 text-blue-600" />
                                </div>

                                <div>

                                    <h2 className="font-semibold text-slate-900">
                                        Skill Sample
                                    </h2>

                                    <p className="text-xs text-slate-400">
                                        Sample work submitted for the{" "}
                                        {verification.skillId ??
                                            "skill"}{" "}
                                        skill
                                    </p>

                                </div>

                            </div>

                            <div className="mt-6 overflow-hidden rounded-2xl bg-slate-100 p-4">

                                <a
                                    href={
                                        skillMember.skillSamplePhotoUrl
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative block overflow-hidden rounded-xl bg-white"
                                >

                                    <img
                                        src={
                                            skillMember.skillSamplePhotoUrl
                                        }
                                        alt={`${verification.skillId ?? "Skill"} sample`}
                                        className="mx-auto max-h-[650px] w-full object-contain transition duration-200 group-hover:scale-[1.01]"
                                    />

                                    <div className="absolute right-4 top-4 flex items-center gap-2 rounded-lg bg-black/70 px-3 py-2 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">

                                        <ExternalLink className="h-3.5 w-3.5" />

                                        Open full image

                                    </div>

                                </a>

                            </div>

                        </section>
                    )}

                {/* =====================================================
                    Verification Information
                ====================================================== */}

                <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                            <FileCheck2 className="h-5 w-5 text-blue-600" />
                        </div>

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Verification Information
                            </h2>

                            <p className="text-xs text-slate-400">
                                Details submitted for this skill verification
                            </p>

                        </div>

                    </div>

                    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                        <InfoItem
                            label="Full Name"
                            value={
                                verification.fullName ??
                                freelancerName
                            }
                        />

                        <InfoItem
                            label="Freelancer ID"
                            value={
                                verification.freelancerId ??
                                "—"
                            }
                        />

                        <InfoItem
                            label="Skill"
                            value={
                                verification.skillId ??
                                "—"
                            }
                        />

                        <InfoItem
                            label="ID Number"
                            value={
                                verification.idNumber ||
                                "Not provided"
                            }
                        />

                        <InfoItem
                            label="Verification Status"
                            value={
                                verification.verificationStatus ??
                                "—"
                            }
                        />

                        <InfoItem
                            label="Verification ID"
                            value={
                                verification.id
                            }
                        />

                    </div>

                </section>

                {/* =====================================================
                    Documents
                ====================================================== */}

                <div className="mt-8 grid gap-8 lg:grid-cols-2">

                    <VerificationImage
                        src={
                            verification.idImageUrl
                        }
                        alt="Government ID"
                        title="Identification Document"
                        description="Submitted government-issued identification"
                    />

                    <VerificationImage
                        src={
                            verification.selfieImageUrl
                        }
                        alt="Freelancer selfie"
                        title="Selfie"
                        description="Selfie submitted during verification"
                    />

                </div>

                {/* =====================================================
                    Additional Documents
                ====================================================== */}

                <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                            <FileImage className="h-5 w-5 text-blue-600" />
                        </div>

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Additional Documents
                            </h2>

                            <p className="text-xs text-slate-400">
                                Supporting documents submitted by the freelancer
                            </p>

                        </div>

                    </div>

                    {verification.additionalDocumentUrl &&
                        verification.additionalDocumentUrl.length >
                        0 ? (
                        <div className="mt-6 grid gap-6 md:grid-cols-2">

                            {verification.additionalDocumentUrl.map(
                                (
                                    url,
                                    index
                                ) => (
                                    <VerificationImage
                                        key={
                                            url
                                        }
                                        src={
                                            url
                                        }
                                        alt={`Additional verification document ${index + 1}`}
                                        title={`Additional Document ${index + 1}`}
                                        description="Supporting verification document"
                                    />
                                )
                            )}

                        </div>
                    ) : (
                        <div className="mt-6 rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-400">
                            No additional documents were submitted.
                        </div>
                    )}

                </section>

                {/* =====================================================
                    Identity Verification Results
                ====================================================== */}

                <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                            <ShieldCheck className="h-5 w-5 text-blue-600" />
                        </div>

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Identity Verification Results
                            </h2>

                            <p className="text-xs text-slate-400">
                                Automated verification results stored with the request
                            </p>

                        </div>

                    </div>

                    <div className="mt-6 grid gap-6 sm:grid-cols-2">

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Face Similarity Score
                            </p>

                            <div className="mt-3 flex items-end gap-2">

                                <span className="text-3xl font-bold text-slate-900">
                                    {similarityPercentage ??
                                        "—"}
                                </span>

                                {similarityPercentage && (
                                    <span className="mb-1 text-sm font-medium text-slate-500">
                                        %
                                    </span>
                                )}

                            </div>

                            {verification.similarityScore !==
                                undefined && (
                                    <div className="mt-4">

                                        <div className="h-2 overflow-hidden rounded-full bg-slate-200">

                                            <div
                                                className="h-full rounded-full bg-blue-600"
                                                style={{
                                                    width: `${Math.min(
                                                        Math.max(
                                                            verification.similarityScore *
                                                            100,
                                                            0
                                                        ),
                                                        100
                                                    )}%`,
                                                }}
                                            />

                                        </div>

                                    </div>
                                )}

                        </div>

                        <div
                            className={`rounded-xl border p-5 ${verification.livenessPassed ===
                                true
                                ? "border-green-200 bg-green-50"
                                : verification.livenessPassed ===
                                    false
                                    ? "border-red-200 bg-red-50"
                                    : "border-slate-200 bg-slate-50"
                                }`}
                        >

                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Liveness Check
                            </p>

                            <div className="mt-3 flex items-center gap-3">

                                {verification.livenessPassed ===
                                    true ? (
                                    <CheckCircle2 className="h-7 w-7 text-green-600" />
                                ) : verification.livenessPassed ===
                                    false ? (
                                    <XCircle className="h-7 w-7 text-red-600" />
                                ) : (
                                    <Clock3 className="h-7 w-7 text-slate-400" />
                                )}

                                <span
                                    className={`text-xl font-bold ${verification.livenessPassed ===
                                        true
                                        ? "text-green-700"
                                        : verification.livenessPassed ===
                                            false
                                            ? "text-red-700"
                                            : "text-slate-700"
                                        }`}
                                >
                                    {verification.livenessPassed ===
                                        true
                                        ? "Passed"
                                        : verification.livenessPassed ===
                                            false
                                            ? "Failed"
                                            : "Not available"}
                                </span>

                            </div>

                        </div>

                    </div>

                </section>

                {/* =====================================================
                    Review Information
                ====================================================== */}

                <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                            <CalendarDays className="h-5 w-5 text-blue-600" />
                        </div>

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Review Information
                            </h2>

                            <p className="text-xs text-slate-400">
                                Administrative review history
                            </p>

                        </div>

                    </div>

                    <div className="mt-6 grid gap-6 sm:grid-cols-2">

                        <InfoItem
                            label="Submitted At"
                            value={formatDateTime(
                                verification.submittedAt ??
                                null
                            )}
                        />

                        <InfoItem
                            label="Reviewed At"
                            value={formatDateTime(
                                verification.reviewedAt ??
                                null
                            )}
                        />

                        <InfoItem
                            label="Reviewed By"
                            value={
                                verification.reviewedBy ??
                                "Not reviewed"
                            }
                        />

                        <InfoItem
                            label="Current Status"
                            value={
                                verification.verificationStatus ??
                                "—"
                            }
                        />

                    </div>

                </section>

                {/* =====================================================
                    Administrative Actions
                ====================================================== */}

                <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                            <ShieldCheck className="h-5 w-5 text-slate-600" />
                        </div>

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Administrative Actions
                            </h2>

                            <p className="text-xs text-slate-400">
                                Review and update this freelancer's skill verification.
                            </p>

                        </div>

                    </div>

                    {isPending ? (
                        <div className="mt-5 flex flex-wrap gap-3">

                            <button
                                type="button"
                                onClick={
                                    handleApprove
                                }
                                disabled={
                                    actionLoading
                                }
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    bg-green-600
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-green-700
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                <CheckCircle2 className="h-4 w-4" />

                                {actionLoading
                                    ? "Processing..."
                                    : "Approve Verification"}
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleReject
                                }
                                disabled={
                                    actionLoading
                                }
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-red-200
                                    bg-red-50
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-red-700
                                    transition
                                    hover:bg-red-100
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                <XCircle className="h-4 w-4" />

                                {actionLoading
                                    ? "Processing..."
                                    : "Reject Verification"}
                            </button>

                        </div>
                    ) : (
                        <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                            This verification request has already been reviewed.
                        </div>
                    )}

                </section>

            </div>

        </main>
    );
}

