interface Props {

    status?: string;

}

export default function VerificationStatusBadge({

    status,

}: Props) {

    switch (status) {

        case "verified":

            return (

                <span
                    className="
                        rounded-full
                        bg-green-100
                        px-3
                        py-1
                        text-sm
                        font-medium
                        text-green-700
                    "
                >

                    ✓ Verified

                </span>

            );

        case "failed":

            return (

                <span
                    className="
                        rounded-full
                        bg-red-100
                        px-3
                        py-1
                        text-sm
                        font-medium
                        text-red-700
                    "
                >

                    ✕ Failed

                </span>

            );

        case "pending":

            return (

                <span
                    className="
                        rounded-full
                        bg-yellow-100
                        px-3
                        py-1
                        text-sm
                        font-medium
                        text-yellow-700
                    "
                >

                    ⏳ Pending

                </span>

            );

        default:

            return (

                <span
                    className="
                        rounded-full
                        bg-slate-100
                        px-3
                        py-1
                        text-sm
                        font-medium
                        text-slate-600
                    "
                >

                    Not Started

                </span>

            );

    }

}