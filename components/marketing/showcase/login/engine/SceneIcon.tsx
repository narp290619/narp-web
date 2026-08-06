"use client";

import {
    BrainCircuit,
    ShieldCheck,
    MapPinned,
    ClipboardCheck,
    Wallet,
    PartyPopper,
} from "lucide-react";

import { JourneyIcon } from "../journey/types";

interface Props {
    icon: JourneyIcon;
    color: string;
}

export default function SceneIcon({
    icon,
    color,
}: Props) {

    const className = "h-6 w-6";

    switch (icon) {

        case "brain":
            return <BrainCircuit className={className} style={{ color }} />;

        case "shield":
            return <ShieldCheck className={className} style={{ color }} />;

        case "map":
            return <MapPinned className={className} style={{ color }} />;

        case "timeline":
            return <ClipboardCheck className={className} style={{ color }} />;

        case "wallet":
            return <Wallet className={className} style={{ color }} />;

        case "success":
            return <PartyPopper className={className} style={{ color }} />;

        default:
            return null;
    }
}