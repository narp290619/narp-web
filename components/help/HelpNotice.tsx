import { ReactNode } from "react";
import {
    Info,
    CheckCircle2,
    TriangleAlert,
    XCircle,
} from "lucide-react";

type HelpNoticeType =
    | "info"
    | "success"
    | "warning"
    | "error";

type HelpNoticeProps = {
    type?: HelpNoticeType;
    title?: string;
    children: ReactNode;
};

const styles = {
    info: {
        icon: Info,
        border: "border-blue-500",
        background: "bg-blue-50",
        iconColor: "text-blue-600",
        titleColor: "text-blue-700",
    },
    success: {
        icon: CheckCircle2,
        border: "border-green-500",
        background: "bg-green-50",
        iconColor: "text-green-600",
        titleColor: "text-green-700",
    },
    warning: {
        icon: TriangleAlert,
        border: "border-orange-500",
        background: "bg-orange-50",
        iconColor: "text-orange-600",
        titleColor: "text-orange-700",
    },
    error: {
        icon: XCircle,
        border: "border-red-500",
        background: "bg-red-50",
        iconColor: "text-red-600",
        titleColor: "text-red-700",
    },
};

export default function HelpNotice({
    type = "info",
    title,
    children,
}: HelpNoticeProps) {
    const style = styles[type];
    const Icon = style.icon;

    return (
        <div
            className={`
                rounded-2xl
                border-l-4
                ${style.border}
                ${style.background}
                p-6
            `}
        >
            <div className="flex items-start gap-4">

                <Icon
                    className={`mt-1 h-6 w-6 flex-shrink-0 ${style.iconColor}`}
                />

                <div className="flex-1">

                    {title && (
                        <h3
                            className={`mb-2 text-lg font-semibold ${style.titleColor}`}
                        >
                            {title}
                        </h3>
                    )}

                    <div
                        className="
                            space-y-4
                            leading-8
                            text-slate-700

                            [&>ul]:list-disc
                            [&>ul]:space-y-2
                            [&>ul]:pl-6

                            [&>ol]:list-decimal
                            [&>ol]:space-y-2
                            [&>ol]:pl-6

                            [&>strong]:font-semibold
                        "
                    >
                        {children}
                    </div>

                </div>

            </div>
        </div>
    );
}