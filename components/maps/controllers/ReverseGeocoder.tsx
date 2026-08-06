"use client";

import { useEffect } from "react";

import { useReverseGeocoder } from "@/hooks/useReverseGeocoder";
import { MapLocation } from "../types";

interface Props {
  location: MapLocation;
  onChange(location: MapLocation): void;
}

export default function ReverseGeocoder({
  location,
  onChange,
}: Props) {
  const { reverseGeocode, isLoaded } = useReverseGeocoder();

  useEffect(() => {
    if (!isLoaded) return;

    if (
      location.address &&
      location.address.trim().length > 0
    ) {
      return;
    }

    let isCancelled = false;

    async function loadAddress() {
      const result = await reverseGeocode(
        location.latitude,
        location.longitude,
      );

      if (isCancelled) return;

      if (
        result.address !== location.address ||
        result.placeId !== location.placeId
      ) {
        onChange({

          ...location,

          ...result,

        });
      }
    }

    loadAddress();

    return () => {
      isCancelled = true;
    };
  }, [
    isLoaded,
    location.latitude,
    location.longitude,
    location.address,
    location.placeId,
    onChange,
    reverseGeocode,
  ]);

  return null;
}