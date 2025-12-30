import React, { useState } from "react";
import calendar from "../assets/calendar.json";

type ScheduleItem = {
    date: string;
    event: string;
    time: string;
};

type MonthData = {
    month: string;
    events: {
        date: string;
        desc: string;
        time: string;
    }[];
};

const schedules: Record<string, ScheduleItem[]> = {};

(calendar as MonthData[]).forEach((monthData) => {
    schedules[monthData.month] = monthData.events.map((event) => ({
        date: event.date,
        event: event.desc,
        time: event.time,
    }));
});

const monthList = Object.keys(schedules);

const Schedule: React.FC = () => {
    const [selectedMonth, setSelectedMonth] = useState<string>(
        new Date().toLocaleString("default", { month: "long" })
    );

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(e.target.value);
    };

    const monthSchedule = schedules[selectedMonth] || [];

    return (
        <div className="schedule-page">
            <h1 className="page-title">📅 Contests Schedule</h1>

            <div className="month-selector">
                <label htmlFor="month">Select month:</label>
                <select
                    id="month"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    className="month-dropdown"
                >
                    {monthList.map((month) => (
                        <option key={month} value={month}>
                            {month}
                        </option>
                    ))}
                </select>
            </div>

            <div className="schedule-list">
                {monthSchedule.map((item, index) => (
                    <div className="schedule-item" key={index}>
                        <div className="schedule-date">{item.date}</div>
                        <div className="schedule-event">{item.event}</div>
                        <div className="schedule-time">{item.time}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Schedule;
