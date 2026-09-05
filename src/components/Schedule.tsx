import React, { useEffect, useMemo, useState } from "react";
import fallbackCalendar from "../assets/calendar.json";
import supabase from "../connection/supabase";

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

const buildSchedules = (
    calendar: MonthData[]
): Record<string, ScheduleItem[]> => {
    const schedules: Record<string, ScheduleItem[]> = {};

    calendar.forEach((monthData) => {
        schedules[monthData.month] = monthData.events.map((event) => ({
            date: event.date,
            event: event.desc,
            time: event.time,
        }));
    });

    return schedules;
};

const Schedule: React.FC = () => {
    const [calendar, setCalendar] = useState<MonthData[]>(
        fallbackCalendar as MonthData[]
    );
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        supabase.functions
            .invoke<MonthData[]>("calendar")
            .then(({ data, error }) => {
                if (cancelled) return;
                if (error || !data || data.length === 0) {
                    setHasError(true);
                } else {
                    setCalendar(data);
                    setHasError(false);
                }
            })
            .catch(() => {
                if (!cancelled) setHasError(true);
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const schedules = useMemo(() => buildSchedules(calendar), [calendar]);
    const monthList = Object.keys(schedules);

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
                {isLoading && <span className="schedule-status">Loading…</span>}
                {hasError && (
                    <span className="schedule-status">
                        Showing last known calendar
                    </span>
                )}
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
