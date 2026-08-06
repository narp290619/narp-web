// import { Booking } from "@/lib/models/booking";
// import {
//     getBookingStatusPresentation,
// } from "../presenters/booking-status.presenter";

// interface Props {

//     booking: Booking;

// }

// export default function BookingStatusBanner({

//     booking,

// }: Props) {

//     const status =
//         getBookingStatusPresentation(booking);

//     return (

//         <div
//             className={`
//                 rounded-2xl
//                 border
//                 p-6
//                 ${status.color}
//             `}
//         >

//             <div className="flex items-start gap-4">

//                 <div className="text-4xl">

//                     {status.icon}

//                 </div>

//                 <div>

//                     <h2 className="text-2xl font-bold">

//                         {status.title}

//                     </h2>

//                     <p className="mt-2">

//                         {status.description}

//                     </p>

//                 </div>

//             </div>

//         </div>

//     );

// }


import { Booking } from "@/lib/models/booking";
import { getBookingStatusUI } from "./booking-status-ui";

interface Props {

    booking: Booking;

}

export default function BookingStatusBanner({

    booking,

}: Props) {

    const ui = getBookingStatusUI(

        booking.status,

        booking.paymentStatus,

    );

    return (

        <div
            className="
                mt-6
                rounded-2xl
                border
                border-orange-200
                bg-orange-50
                p-6
            "
        >

            <h2 className="text-xl font-semibold">

                {ui.title}

            </h2>

            <p className="mt-2 text-slate-600">

                {ui.description}

            </p>

        </div>

    );

}