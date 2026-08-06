// "use client";

// import { useMember } from "@/hooks/useMember";

// import ReviewSummaryCard
//     from "@/components/maps/features/reviews/components/ReviewSummaryCard";

// import ReviewList
//     from "@/components/maps/features/reviews/components/ReviewList";

// interface Props {

//     memberId: string;

// }

// export default function FreelancerProfileClient({

//     memberId,

// }: Props) {

//     const {

//         member,

//         loading,

//     } = useMember(memberId);

//     if (loading) {

//         return <div>Loading...</div>;

//     }

//     if (!member) {

//         return <div>Freelancer not found.</div>;

//     }

//     return (

//         <div
//             className="
//                 mx-auto
//                 max-w-5xl
//                 space-y-8
//             "
//         >

//             <section
//                 className="
//                     rounded-2xl
//                     border
//                     bg-white
//                     p-8
//                     shadow-sm
//                 "
//             >

//                 <div
//                     className="
//                         flex
//                         items-center
//                         gap-6
//                     "
//                 >

//                     <img
//                         src={member.profileImageUrl}
//                         alt={`${member.firstName} ${member.lastName}`}
//                         className="
//                             h-24
//                             w-24
//                             rounded-full
//                             object-cover
//                         "
//                     />

//                     <div>

//                         <h1
//                             className="
//                                 text-3xl
//                                 font-bold
//                             "
//                         >

//                             {member.firstName} {member.lastName}

//                         </h1>

//                         <p
//                             className="
//                                 mt-2
//                                 text-slate-600
//                             "
//                         >

//                             {member.aboutMemberSkill}

//                         </p>

//                         <p
//                             className="
//                                 mt-2
//                                 font-medium
//                                 text-orange-600
//                             "
//                         >

//                             Starting at ₱{member.startingPrice}

//                         </p>

//                     </div>

//                 </div>

//             </section>

//             <ReviewSummaryCard

//                 rating={member.rating}

//                 reviewCount={member.reviewCount}

//             />

//             <ReviewList

//                 freelancerId={member.userId}

//             />

//         </div>

//     );

// }