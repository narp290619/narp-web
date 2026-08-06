export type JourneyIcon =
    | "brain"
    | "shield"
    | "map"
    | "timeline"
    | "wallet"
    | "success";

export interface JourneyScene {
    id: string;

    title: string;

    subtitle: string;

    assistantMessages: string[];

    icon: JourneyIcon;

    accentColor: string;

    duration: number;
}