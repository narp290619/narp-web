"use client";

interface Props {

    date: string;

    time: string;

    onDateChange(value: string): void;

    onTimeChange(value: string): void;

}

export default function BookingScheduleStep({

    date,

    time,

    onDateChange,

    onTimeChange,

}: Props) {

    return (

        <div className="space-y-8">

            <div>

                <label className="mb-2 block font-semibold">

                    Preferred Date

                </label>

                <input
                    type="date"
                    value={date}
                    onChange={(e) =>
                        onDateChange(e.target.value)
                    }
                    className="w-full rounded-xl border p-4"
                />

            </div>

            <div>

                <label className="mb-2 block font-semibold">

                    Preferred Time

                </label>

                <input
                    type="time"
                    value={time}
                    onChange={(e) =>
                        onTimeChange(e.target.value)
                    }
                    className="w-full rounded-xl border p-4"
                />

            </div>

        </div>

    );

}