import { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

export default function LegalInfoBox({
    children,
}: Props) {

    return (

        <div className="rounded-2xl border-l-4 border-blue-500 bg-blue-50 p-5 text-blue-900 leading-7">

            {children}

        </div>

    );

}