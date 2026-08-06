"use client";

interface Props {

    description: string;

    onDescriptionChange(value: string): void;

}

export default function BookingDescriptionStep({

    description,

    onDescriptionChange,

}: Props) {

    return (

        <div>

            <label className="mb-2 block font-semibold">

                Describe the job

            </label>

            <textarea
                rows={8}
                value={description}
                onChange={(e) =>
                    onDescriptionChange(
                        e.target.value,
                    )
                }
                className="w-full rounded-xl border p-4"
                placeholder="Describe the work to be done..."
            />

        </div>

    );

}