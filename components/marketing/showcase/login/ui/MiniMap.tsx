"use client";

import DriverMarker from "./DriverMarker";
import CustomerMarker from "./CustomerMarker";
import RouteLine from "./RouteLine";
import ETAChip from "./ETAChip";

export default function MiniMap() {

    return (

        <div

            className="
                relative
                h-[420px]
                overflow-hidden
                rounded-[34px]
                bg-[#edf3f8]
            "

        >

            <ETAChip />

            {/* Roads */}

            <div className="absolute left-8 top-0 h-full w-5 bg-white rotate-12"/>

            <div className="absolute left-32 top-0 h-full w-5 bg-white -rotate-6"/>

            <div className="absolute right-20 top-0 h-full w-5 bg-white rotate-12"/>

            <div className="absolute top-24 left-0 h-5 w-full bg-white"/>

            <div className="absolute bottom-24 left-0 h-5 w-full bg-white"/>

            {/* Parks */}

            <div className="absolute left-10 top-12 h-24 w-24 rounded-full bg-green-200"/>

            <div className="absolute right-12 bottom-20 h-20 w-20 rounded-full bg-green-200"/>

            {/* Water */}

            <div className="absolute right-0 top-0 h-full w-14 bg-blue-200"/>

            <RouteLine/>

            <DriverMarker/>

            <CustomerMarker/>

        </div>

    );

}