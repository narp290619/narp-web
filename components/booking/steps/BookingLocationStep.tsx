"use client";

interface Props {

    address: string;

    onAddressChange(value: string): void;

}

export default function BookingLocationStep({

    address,

    onAddressChange,

}: Props) {

    return (

        <div>

            <label className="mb-2 block font-semibold">

                Service Address

            </label>

            <textarea
                rows={5}
                value={address}
                onChange={(e) =>
                    onAddressChange(e.target.value)
                }
                className="w-full rounded-xl border p-4"
                placeholder="Enter complete service address..."
            />

        </div>

    );

}