import { BookingStatus }
    from "@/lib/models/booking";

import {
    getTrackingStatusInfo,
}
from "@/lib/utils/tracking-status";
import StatusBadge from "../common/StatusBadge";

interface Props {

    status: BookingStatus;

}

export default function TrackingStatusBadge({

    status,

}: Props) {

    const info =
        getTrackingStatusInfo(status);

    return (

        <StatusBadge
            variant={info.badgeVariant}
        >

            {info.badgeLabel}

        </StatusBadge>

    );

}