import React from "react";
import { formatFullDateTime, formatHours, formatMonth } from "../Utils/formatRouteTime";
import { FaStopwatch } from "react-icons/fa6";
import { FaHotel, FaTruckLoading, FaTruck } from "react-icons/fa";
import { MdHotel, MdLocalGasStation } from "react-icons/md";
import { IoCloudOffline } from "react-icons/io5";
import { BsCaretUpSquareFill, BsCaretDownSquareFill } from "react-icons/bs";


export const TypeIcon = ({ type }) => {
    switch ((type || "").toLowerCase()) {
        case "on duty":
            return <FaTruckLoading className="bg-green-500 rounded-full p-2 size-9 text-white" />;
        case "off duty":
            return <IoCloudOffline className="bg-orange-500 rounded-full p-2 size-9 text-white" />;
        case "sleeper berth":
            return <FaHotel className="bg-red-500 rounded-full p-2 size-9 text-white" />;
        case "driving":
            return <FaTruck className="bg-blue-500 rounded-full p-2 size-9 text-white" />;
        default:
            return null;
    }
};

export default function SideBar({ routeData, loadingComponent, errorComponent, setSelectedStop }) {
    const LoadingSkeleton = () => (
        <div className="animate-pulse w-full space-y-4">
            <div className="h-8 bg-gray-700 rounded w-1/3"></div>
            <div className="bg-[#1b1e27] border border-gray-700 rounded-lg p-4 space-y-3">
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                <div className="flex justify-between mt-3">
                    <div className="h-5 bg-gray-700 rounded w-1/4"></div>
                    <div className="h-5 bg-gray-700 rounded w-1/4"></div>
                </div>
                <div className="flex justify-between mt-3">
                    <div className="h-5 bg-gray-700 rounded w-1/4"></div>
                    <div className="h-5 bg-gray-700 rounded w-1/4"></div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                <div className="h-14 bg-gray-700 rounded"></div>
                <div className="h-14 bg-gray-700 rounded"></div>
                <div className="h-14 bg-gray-700 rounded"></div>
            </div>
        </div>
    );

    if (!routeData && !loadingComponent && !errorComponent) {
        return (
            <div className="w-full md:w-90 text-white h-auto p-5 border border-gray-700 rounded-lg bg-[#111117] flex flex-col gap-4">
                <h1 className="text-3xl font-semibold">Route Details</h1>
            </div>
        );
    }

    if (loadingComponent) {
        return (
            <div className="w-full md:w-90 text-white h-auto p-5 border border-gray-700 rounded-lg bg-[#111117] flex flex-col gap-4">
                <h1 className="text-3xl font-semibold">Route Details</h1>
                <LoadingSkeleton />
            </div>
        );
    }

    if (errorComponent) {
        return (
            <div className="w-full md:w-90 text-white h-auto p-5 border border-gray-700 rounded-lg bg-[#111117] flex flex-col gap-4">
                <h1 className="text-3xl font-semibold">Route Details</h1>
                <p className="text-red-400">{errorComponent}</p>
            </div>
        );
    }

    return (
        <div className="w-full md:w-90 text-white h-auto p-5 border border-gray-700 rounded-lg items-start flex bg-[#111117] flex-col gap-4">
            <h1 className="text-3xl font-semibold">Route Details</h1>

            <div className="bg-[#1b1e27] border border-gray-700 w-full rounded-lg py-4 px-3">
                <h2 className="text-lg font-md mb-2">Route Summary</h2>
                <div className="flex w-full items-center py-2 justify-between divide-x divide-white/50">
                    <div className="flex py-2 pl-3 w-1/2 flex-col items-start">
                        <p className="text-md font-semibold">{routeData?.summary?.total_miles ?? "-"}</p>
                        <span className="text-xs text-gray-400">Total miles</span>
                    </div>
                    <div className="flex py-2 pl-3 w-1/2 flex-col items-start">
                        <p className="text-md font-semibold">{routeData?.summary?.predicted_driving_time ?? "-"} hrs</p>
                        <span className="text-xs text-gray-400">Predicted driving time</span>
                    </div>
                </div>
                <div className="flex w-full py-2 items-center justify-between divide-x divide-white/50 mt-2">
                    <div className="flex py-2 pl-3 w-1/2 flex-col items-start">
                        <p className="text-md font-semibold">{routeData?.summary?.total_shifts ?? "-"}</p>
                        <span className="text-xs text-gray-400">Total shifts</span>
                    </div>
                    <div className="flex py-2 pl-3 w-1/2 flex-col items-start">
                        <p className="text-md font-semibold">{formatMonth(routeData?.summary?.total_estimated_arrival)}</p>
                        <span className="text-xs text-gray-400">Estimated arrival with stops</span>
                    </div>
                </div>
            </div>

            <h2 className="text-lg font-md mt-1">Timeline</h2>
            <ul className="w-full max-h-50 scrollbar-gray overflow-y-auto">
                {routeData?.timeline?.map((t, i) => (
                    <li
                        key={i}
                        onClick={() =>
                            setSelectedStop({
                                id: i,
                                position: { lat: t.location.latitude, lng: t.location.longitude },
                                type: t.type,
                                reason: t.reason,
                                start_time: t.start_time,
                                end_time: t.end_time,
                                duration: t.duration,
                                shift: t.shift,
                            })
                        }
                        className="flex rounded-lg border border-gray-700 bg-[#1b1e27] w-full px-3 items-start gap-3 py-2 cursor-pointer hover:bg-[#2a2d39]"
                    >
                        <TypeIcon type={t.type} />
                        <div className="flex-1 flex-col">
                            <p className="font-medium text-white">
                                {t.type} {t.reason && "—"} {t.reason}
                            </p>
                            <div className="flex w-full text-xs text-gray-400 items-center justify-between">
                                <p>{formatFullDateTime(t.start_time, t.end_time)}</p>
                                <p>{formatHours(t.duration)}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            <h2 className="text-lg font-md mt-1">Legends</h2>
            <div className="bg-[#1b1e27] border border-gray-700 w-full rounded-lg p-4">
                <ul className="grid grid-cols-2 gap-4 text-sm text-white-700">
                    <li className="flex items-center gap-2">
                        <MdLocalGasStation className="bg-red-700 rounded-full p-2 size-9 text-white" />
                        <span>Fuel</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <FaStopwatch className="bg-[#AB6400] rounded-full p-2 size-9 text-white" />
                        <span>30mns Break</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <BsCaretUpSquareFill className="bg-blue-700 rounded-full p-2 size-9 text-white" />
                        <span>Pickup</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <BsCaretDownSquareFill className="bg-green-500 rounded-full p-2 size-9 text-white" />
                        <span>Dropoff</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <MdHotel className="bg-[#8145B5] rounded-full p-2 size-9 text-white" />
                        <span>Rest</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
