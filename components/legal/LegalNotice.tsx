import { ReactNode } from "react";

type Props = {
    title: string;
    children: ReactNode;
};

export default function LegalNotice({
    title,
    children,
}: Props) {

    return (

        <div className="rounded-2xl border-l-4 border-yellow-500 bg-yellow-50 p-5">

            <h3 className="font-bold text-yellow-800">

                {title}

            </h3>

            <div className="mt-3 text-yellow-900 leading-7">

                {children}

            </div>

        </div>

    );

}