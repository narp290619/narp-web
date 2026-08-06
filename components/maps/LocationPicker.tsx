// "use client";

// import {
//     Map,
//     AdvancedMarker,
// } from "@vis.gl/react-google-maps";

// interface Props {

//     latitude: number;

//     longitude: number;

//     onLocationChanged(
//         latitude: number,
//         longitude: number,
//     ): void;

// }

// export default function LocationPicker({

//     latitude,

//     longitude,

//     onLocationChanged,

// }: Props) {

//     return (

//         <div className="overflow-hidden rounded-3xl border">

//             <Map
//                 style={{
//                     width: "100%",
//                     height: "450px",
//                 }}
//                 defaultZoom={16}
//                 defaultCenter={{
//                     lat: latitude,
//                     lng: longitude,
//                 }}
//                 gestureHandling="greedy"
//                 mapId="NARP_MAP"
//                 onClick={(event) => {

//                     if (
//                         !event.detail.latLng
//                     ) {

//                         return;

//                     }

//                     onLocationChanged(
//                         event.detail.latLng.lat,
//                         event.detail.latLng.lng,
//                     );

//                 }}
//             >

//                 <AdvancedMarker
//                     position={{
//                         lat: latitude,
//                         lng: longitude,
//                     }}
//                 />

//             </Map>

//         </div>

//     );

// }