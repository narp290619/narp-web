interface Props {

    reason: string;

}

export default function AIReason({

    reason,

}: Props) {

    return (

        <div className="rounded-3xl border border-orange-200 bg-orange-50 p-6">

            <h3 className="font-bold">

                Why these recommendations?

            </h3>

            <p className="mt-3 text-slate-600">

                {reason}

            </p>

        </div>

    );

}