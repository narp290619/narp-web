import {
    getDownloadURL,
    ref,
    uploadString,
} from "firebase/storage";

import { storage } from "@/lib/firebase";

export interface UploadSelfieResult {

    downloadUrl: string;

    storagePath: string;

}

export async function uploadSelfie(

    bookingId: string,

    image: string,

): Promise<UploadSelfieResult> {

    const storageRef = ref(

        storage,

        `bookings/${bookingId}/verification/selfie.jpg`,

    );

    await uploadString(

        storageRef,

        image,

        "data_url",

    );

    const downloadUrl = await getDownloadURL(

        storageRef,

    );

    return {

        downloadUrl,

        storagePath: storageRef.fullPath,

    };

}