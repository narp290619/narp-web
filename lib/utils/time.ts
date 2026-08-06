import { Timestamp } from "firebase/firestore";

export function getRelativeTime(
    timestamp?: Timestamp | null,
): string {

    if (!timestamp) {

        return "--";

    }

    const seconds = Math.floor(

        (Date.now() - timestamp.toDate().getTime()) / 1000,

    );

    if (seconds < 5) {

        return "Just now";

    }

    if (seconds < 60) {

        return `${seconds} sec ago`;

    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {

        return `${minutes} min ago`;

    }

    const hours = Math.floor(minutes / 60);

    return `${hours} hr ago`;

}