import React, { useMemo, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import Map from "./Map";
import SideBar from "./SideBar";

export default function Planner({ loadingComponent, errorComponent, routeData }) {


    const [selectedStop, setSelectedStop] = useState(null);

    const markers = useMemo(() => {
        if (!routeData?.timeline) return [];
        return routeData.timeline
            .filter(item => item.type !== "Driving")
            .map((item, idx) => ({
                id: idx,
                position: { lat: item.location.latitude, lng: item.location.longitude },
                type: item.type,
                reason: item.reason,
                start_time: item.start_time,
                end_time: item.end_time,
                address: item.address,
                duration: item.duration,
                shift: item.shift
            }));
    }, [routeData]);


    return (
        <div className="flex flex-col-reverse md:flex-row gap-4 min-h-[80vh] px-4 pb-7 justify-center">
            <div className="flex flex-col md:flex-row max-w-[1150px] w-full items-stretch gap-4">
                <div className="md:flex-1 h-[60vh] md:h-auto relative rounded-lg border border-gray-700 overflow-hidden">
                    <Map
                        routeData={routeData}
                        markers={markers}
                        selectedStop={selectedStop}
                        setSelectedStop={setSelectedStop}
                        loadingComponent={loadingComponent}
                        errorComponent={errorComponent}
                    />
                </div>

                <SideBar
                    routeData={routeData}
                    setSelectedStop={setSelectedStop}
                    loadingComponent={loadingComponent}
                    errorComponent={errorComponent}
                />
            </div>
        </div>
    );
}
