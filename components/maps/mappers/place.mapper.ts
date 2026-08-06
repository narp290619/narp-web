import { PlaceSearchResult } from "../types/PlaceSearchResult";

export function mapPrediction(
    prediction: google.maps.places.AutocompletePrediction,
): PlaceSearchResult {

    return {

        placeId: prediction.place_id,

        title:
            prediction.structured_formatting.main_text,

        subtitle:
            prediction.structured_formatting.secondary_text,

        description:
            prediction.description,

    };

}