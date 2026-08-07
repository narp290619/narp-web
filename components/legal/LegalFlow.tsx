type Props = {
    steps: string[];
};

export default function LegalFlow({
    steps,
}: Props) {

    return (

        <div className="rounded-3xl border bg-gray-50 p-8">

            {steps.map((step, index) => (

                <div key={step}>

                    <div className="rounded-xl border bg-white p-4 text-center font-semibold">

                        {step}

                    </div>

                    {index < steps.length - 1 && (

                        <div className="py-2 text-center text-2xl text-green-600">

                            ↓

                        </div>

                    )}

                </div>

            ))}

        </div>

    );

}