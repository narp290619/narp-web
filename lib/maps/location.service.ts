export async function getCurrentLocation() {

    if (!navigator.geolocation) {

        throw new Error(
            "Geolocation is not supported by this browser.",
        );

    }

    return new Promise<GeolocationPosition>(

        (resolve, reject) => {

            navigator.geolocation.getCurrentPosition(

                resolve,

                reject,

                {

                    enableHighAccuracy: true,

                    timeout: 10000,

                    maximumAge: 0,

                },

            );

        },

    );

}