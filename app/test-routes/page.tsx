"use client";

import { getRoute } from "@/lib/services/google-routes.service";

export default function TestRoutesPage() {

    async function handleTest() {

        console.log("Button clicked");

        const result = await getRoute({

            origin: {

                lat: 1.3745542628991854,
                lng: 103.93094342019754,

            },

            destination: {

                lat: 1.3257477,
                lng: 103.9056632,

            },

        });

        console.log(result);

    }

    return (

        <div className="pt-32 px-10">

            <button
                onClick={handleTest}
                className="rounded-lg bg-blue-600 px-6 py-3 text-white"
            >

                Test Google Routes

            </button>

        </div>

    );

}