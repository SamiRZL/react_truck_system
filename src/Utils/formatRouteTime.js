export function formatFullDateTime(start_time, end_time, durationMins) {
    const parseDate = (str) => {
        const [date, time] = str.split(" ");
        const [day, month, year] = date.split("/").map(Number);
        const [hour, minute, second] = time.split(":").map(Number);
        return new Date(year, month - 1, day, hour, minute, second);
    };

    const startDate = parseDate(start_time);
    const endDate = parseDate(end_time);



    // Format weekday + time
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const formatTime = (date) =>
        date
            .toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            })
            .toUpperCase();

    const startDay = dayNames[startDate.getDay()];
    const endDay = dayNames[endDate.getDay()];
    const startTime = formatTime(startDate);
    const endTime = formatTime(endDate);



    return `${startDay} ${startTime} - ${endDay} ${endTime}`;
}

export function formatStartTime(start_time) {
    if (!start_time) return "";

    // Parse "DD/MM/YYYY HH:mm:ss"
    const [date, time] = start_time.split(" ");
    const [day, month, year] = date.split("/").map(Number);
    const [hour, minute, second] = time.split(":").map(Number);

    const startDate = new Date(year, month - 1, day, hour, minute, second);

    // Convert to "12:30 AM" format
    const formattedTime = startDate
        .toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        })
        .toUpperCase();

    return formattedTime;
}


export function formatHours(durationMins) {

    let duration = durationMins;


    let formattedDuration;
    if (duration < 60) {
        formattedDuration = `${Math.round(duration)}mns`;
    } else {
        const h = Math.floor(duration / 60);
        const m = Math.round(duration % 60);
        formattedDuration = m > 0 ? `${h}h${m}mns` : `${h}h`;
    }

    return formattedDuration;
}


export function formatMonth(dateTimeStr) {
    if (!dateTimeStr) return "";

    // Parse "DD/MM/YYYY HH:mm:ss"
    const [date, time] = dateTimeStr.split(" ");
    const [day, monthNum, year] = date.split("/").map(Number);
    const [hour, minute, second] = time.split(":").map(Number);

    const dateObj = new Date(year, monthNum - 1, day, hour, minute, second);

    // Format month names safely
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthLabel = monthNames[dateObj.getMonth()];

    const formattedDay = dateObj.getDate();

    // 12-hour format with AM/PM
    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // 0 → 12 for midnight

    return `${monthLabel} ${formattedDay}, ${hours}:${minutes} ${ampm}`;
}

