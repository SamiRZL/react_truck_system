import DriverForm from "../Components/DriverForm"
import Planner from "../Components/Planner"
import { useState } from "react"
import axios from "axios"
const Dashboard = () => {

    const [loading, setLoading] = useState(false);
    const [routeData, setRouteData] = useState(null)
    const [error, setError] = useState(null);



    const fetchRoute = async ({ currentLocation, pickupLocation, dropoffLocation, cycleHours, time }) => {
        setLoading(true)
        const body = {
            origin: currentLocation,
            pickup: pickupLocation,
            destination: dropoffLocation,
            currentCycle: Number(cycleHours),
            time
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/route/`, body)
            const result = response.data
            setRouteData(result)
            console.log("response", result)
        } catch (e) {
            console.log("error", e)
            setError(err.message || "Something went wrong when trying to fetch routes.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full flex bg-[#111117] flex-col  min-h-screen">
            <DriverForm fetchRoute={fetchRoute} />

            <Planner loadingComponent={loading} errorComponent={error} routeData={routeData} />
        </div>
    )
}

export default Dashboard