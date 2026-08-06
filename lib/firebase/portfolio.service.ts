import {
    arrayRemove,
    arrayUnion,
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore";

import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytes,
} from "firebase/storage";

import {
    db,
    storage,
} from "@/lib/firebase";

/**
 * Upload a new portfolio image.
 *
 * Returns the download URL.
 */
export async function uploadPortfolioImage(

    memberId: string,

    file: File,

): Promise<string> {

    const extension =

        file.name.split(".").pop();

    const filename =

        `${Date.now()}.${extension}`;

    const storageRef = ref(

        storage,

        `portfolio/${memberId}/${filename}`,

    );

    await uploadBytes(

        storageRef,

        file,

    );

    return getDownloadURL(storageRef);

}

/**
 * Read every portfolio image URL.
 */
export async function getPortfolioImages(

    memberId: string,

): Promise<string[]> {

    const snapshot = await getDoc(

        doc(
            db,
            "SkillMembers",
            memberId,
        ),

    );

    if (!snapshot.exists()) {

        return [];

    }

    const data = snapshot.data();

    return data.portfolioImages ?? [];

}

/**
 * Add an image URL into portfolioImages[]
 */
export async function addPortfolioImage(

    memberId: string,

    imageUrl: string,

): Promise<void> {

    await updateDoc(

        doc(
            db,
            "SkillMembers",
            memberId,
        ),

        {

            portfolioImages: arrayUnion(imageUrl),

        },

    );

}

/**
 * Remove an image.
 */
export async function removePortfolioImage(

    memberId: string,

    imageUrl: string,

): Promise<void> {

    await updateDoc(

        doc(
            db,
            "SkillMembers",
            memberId,
        ),

        {

            portfolioImages: arrayRemove(imageUrl),

        },

    );

}

/**
 * Delete an image from Firebase Storage.
 */
export async function deletePortfolioFile(

    imageUrl: string,

): Promise<void> {

    const storageRef = ref(

        storage,

        imageUrl,

    );

    await deleteObject(storageRef);

}