"use client";

import { useState } from "react";

import GoogleMap from "../core/GoogleMap";
import CurrentLocationButton from "../features/CurrentLocationButton";
import PlaceSearchBox from "../features/PlaceSearchBox";
import SelectedLocationCard from "../features/SelectedLocationCard";
import ReverseGeocoder from "../controllers/ReverseGeocoder";

import { MapLocation } from "../types";
import { PlaceSearchResult } from "../types/PlaceSearchResult";

import { usePlaceSearch } from "@/hooks/usePlaceSearch";
import { getPlaceDetails } from "../services/place-details.service";
import ServiceAreaBadge from "../features/ServiceAreaBadge";
import { useServiceArea } from "@/hooks/useServiceArea";

interface Props {

  value: MapLocation;

  onChange(
    location: MapLocation,
  ): void;

  height?: number;

}

export default function LocationPicker({

  value,

  onChange,

  height = 450,

}: Props) {

  const [

    search,

    setSearch,

  ] = useState("");

  const {

    loading,

    results,

    search: searchPlaces,

    clear,

    resetSession,

  } = usePlaceSearch();

  const handlePlaceSelected = async (
    place: PlaceSearchResult,
  ) => {

    try {

      const location =
        await getPlaceDetails(
          place.placeId,
        );

      onChange(location);

      setSearch(
        location.address ?? "",
      );

      clear();

      resetSession();

    } catch (error) {

      console.error(
        "Failed to retrieve place details.",
        error,
      );

    }

  };

  // const {

  //   withinArea,

  //   distanceKm,

  // } = useServiceArea(

  //   value,

  //   {

  //     center: {

  //       latitude: freelancer.latitude,

  //       longitude: freelancer.longitude,

  //     },

  //     radiusKm: freelancer.serviceRadiusKm,

  //   },

  // );

  return (

    <div className="space-y-4">

      <PlaceSearchBox

        value={search}

        onChange={setSearch}

        loading={loading}

        results={results}

        onSearch={searchPlaces}

        onSelect={handlePlaceSelected}

        onClear={clear}

      />

      <ReverseGeocoder

        location={value}

        onChange={onChange}

      />

      <div className="flex justify-end">

        <CurrentLocationButton

          onLocationFound={onChange}

        />

      </div>

      <GoogleMap

        value={value}

        onChange={onChange}

        height={height}

      />

      <SelectedLocationCard

        location={value}

      />

    </div>

  );

}