// import {
//     collection,
//     getDocs,
// } from "firebase/firestore";

// import { db } from "@/lib/firebase";

// import { Skill } from "@/lib/models/skill";

// export async function getSkills(): Promise<Skill[]> {

//     const snapshot = await getDocs(
//         collection(db, "Skills")
//     );

//     return snapshot.docs.map((doc) => ({

//         id: doc.id,

//         ...(doc.data() as Omit<Skill, "id">),

//     }));

// }