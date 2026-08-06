"use client";

import { MapPin } from "lucide-react";
import { MapLocation } from "../types";


interface Props {
  location: MapLocation;
}

export default function SelectedLocationCard({
  location,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="flex items-start gap-3">
        <MapPin
          className="mt-0.5 text-orange-500"
          size={20}
        />

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-500">
            Selected Location
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-700">
            {location.address ?? "Looking up address..."}
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-xs text-slate-500">
                Latitude
              </div>

              <div className="mt-1 font-mono text-sm font-semibold">
                {location.latitude.toFixed(6)}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500">
                Longitude
              </div>

              <div className="mt-1 font-mono text-sm font-semibold">
                {location.longitude.toFixed(6)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}