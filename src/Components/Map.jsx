import React, { useEffect, useRef, useMemo } from "react";
import { GoogleMap, Marker, Polyline, InfoWindow, useLoadScript, InfoBox } from "@react-google-maps/api";
import { FaStopwatch } from "react-icons/fa";
import { MdHotel, MdLocalGasStation } from "react-icons/md";
import { BsCaretUpSquareFill, BsCaretDownSquareFill } from "react-icons/bs";
import ReactDOMServer from "react-dom/server";
import { formatStartTime, formatHours } from "../Utils/formatRouteTime";

export const reasonIconMap = {
    "30 min break": { icon: FaStopwatch, color: "#AB6400" },
    "10 hour rest": { icon: MdHotel, color: "#8145B5" },
    "fueling": { icon: MdLocalGasStation, color: "#EF4444" },
    "pickup point": { icon: BsCaretUpSquareFill, color: "#2563EB" },
    "dropoff point": { icon: BsCaretDownSquareFill, color: "#22C55E" },
};

export const ReasonIcon = ({ reason }) => {
    const entry = reasonIconMap[(reason || "").toLowerCase()];
    if (!entry) return null;

    const { icon: Icon, color } = entry;
    const size = 36;

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
            <circle cx={size / 2} cy={size / 2} r={size / 2} fill={color} />
            <foreignObject x="0" y="0" width={size} height={size}>
                <div
                    xmlns="http://www.w3.org/1999/xhtml"
                    style={{
                        width: size,
                        height: size,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Icon width={24} height={24} fill="#fff" />
                </div>
            </foreignObject>
        </svg>
    );
};

export const getMarkerIcon = (reason) => {
    const iconSvg = ReactDOMServer.renderToStaticMarkup(<ReasonIcon reason={reason} />);
    const svgBase64 = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(iconSvg);

    return {
        url: svgBase64,
        scaledSize: new window.google.maps.Size(36, 36),
        anchor: new window.google.maps.Point(18, 18),
    };
};

export default function Map({ loadingComponent, errorComponent, routeData, markers, selectedStop, setSelectedStop }) {
    const apiKey = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;
    const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: apiKey, libraries: ["places"] });
    const mapRef = useRef(null);

    const defaultCenter = useMemo(() => ({ lat: 39.8283, lng: -98.5795 }), []); // geographic center of USA
    const defaultZoom = 4;

    const memoizedMarkers = useMemo(() => {
        if (!markers?.length) return [];
        return markers.map((m) => ({
            ...m,
            icon: getMarkerIcon(m.reason),
        }));
    }, [markers]);

    useEffect(() => {
        if (!mapRef.current || !routeData?.polyline?.length) return;
        const map = mapRef.current;
        const bounds = new window.google.maps.LatLngBounds();

        routeData.polyline.forEach((coord) => {
            const latLng = Array.isArray(coord) ? { lat: coord[0], lng: coord[1] } : coord;
            bounds.extend(latLng);
        });
        memoizedMarkers.forEach((m) => bounds.extend(m.position));

        if (!bounds.isEmpty()) map.fitBounds(bounds);
    }, [routeData?.polyline, memoizedMarkers]);

    return (
        <div className="relative w-full h-full">
            {loadError && (
                <div className="absolute inset-0 flex justify-center items-center bg-[#111117]/80 text-red-400 z-10">
                    <p>Failed to load Google Maps</p>
                </div>
            )}

            {loadingComponent && (
                <div className="absolute inset-0 flex justify-center items-center bg-[#111117]/70 z-10">
                    <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                </div>
            )}

            {errorComponent && (
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-[#111117]/70 text-red-400 z-10">
                    <p className="mb-2">{errorComponent}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {isLoaded && (
                <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={defaultCenter}
                    zoom={defaultZoom}
                    onLoad={(map) => (mapRef.current = map)}
                    options={{
                        //  gestureHandling: "greedy", 
                    }}
                >
                    {/* Draw route if available */}
                    {routeData?.polyline?.length > 0 && (
                        <Polyline
                            path={routeData.polyline.map(([lat, lng]) => ({ lat, lng }))}
                            options={{ strokeWeight: 4, strokeColor: "#2563eb", clickable: false }}
                        />
                    )}

                    {/* Markers */}
                    {memoizedMarkers.map((m) => (
                        <Marker
                            key={m.id}
                            position={m.position}
                            onClick={() => setSelectedStop(m)}
                            icon={m.icon}
                        />
                    ))}

                    {/* Info window */}
                    {selectedStop && (
                        <InfoBox
                            position={selectedStop.position}
                            options={{
                                closeBoxURL: "",
                                enableEventPropagation: true,
                                pixelOffset: new window.google.maps.Size(0, -40),
                            }}
                            onCloseClick={() => setSelectedStop(null)}
                        >
                            <div className="max-w-[300px] rounded-lg p-4 border border-gray-700 bg-[#111117]">
                                <h2 className="font-semibold text-lg text-white mb-1">
                                    {selectedStop.reason.toUpperCase()} STOP
                                </h2>
                                <div className="w-full gap-4 items-start font-medium flex">
                                    <div className="flex flex-col text-sm justify-end text-gray-500">
                                        <span>Location</span>
                                        <span>Time</span>
                                        <span>Duration</span>
                                        <span>Shift n°</span>
                                    </div>
                                    <div className="flex flex-col justify-end text-sm text-white min-w-0">
                                        <span className="truncate block max-w-[180px]" title={selectedStop.address}>
                                            {selectedStop.address}
                                        </span>
                                        <span>{formatStartTime(selectedStop.start_time)}</span>
                                        <span>{formatHours(selectedStop.duration)}</span>
                                        <span>{selectedStop.shift}</span>
                                    </div>
                                </div>
                            </div>

                        </InfoBox>
                    )}
                </GoogleMap>
            )}
        </div>
    );
}

