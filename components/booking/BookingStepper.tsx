"use client";

interface Props {
    currentStep: number;
}

const steps = [
    "Schedule",
    "Location",
    "Description",
    "Review",
];

export default function BookingStepper({
    currentStep,
}: Props) {

    return (

        <div className="mb-10 flex items-center">

            {steps.map((step, index) => {

                const active = index <= currentStep;

                return (

                    <div
                        key={step}
                        className="flex flex-1 items-center"
                    >

                        <div
                            className={`
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-full
                                font-bold
                                transition

                                ${
                                    active
                                        ? "bg-orange-500 text-white"
                                        : "bg-slate-200 text-slate-500"
                                }
                            `}
                        >

                            {index + 1}

                        </div>

                        <div className="ml-3">

                            <div
                                className={
                                    active
                                        ? "font-semibold"
                                        : "text-slate-500"
                                }
                            >

                                {step}

                            </div>

                        </div>

                        {index !== steps.length - 1 && (

                            <div
                                className={`
                                    mx-6
                                    h-1
                                    flex-1
                                    rounded-full

                                    ${
                                        index < currentStep
                                            ? "bg-orange-500"
                                            : "bg-slate-200"
                                    }
                                `}
                            />

                        )}

                    </div>

                );

            })}

        </div>

    );

}