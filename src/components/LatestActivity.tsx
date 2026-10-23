import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllActivities } from "../database/activities";
import type { Activity } from "./Activities";

const LatestActivity: React.FC = () => {
    const [activity, setActivity] = useState<Activity | null>(null);

    useEffect(() => {
        const fetchLatestActivity = async () => {
            const data = await getAllActivities();
            setActivity(data[0] ?? null);
        };
        fetchLatestActivity();
    }, []);

    if (!activity) return null;

    return (
        <div className="latest-activity-panel">
            <h3 className="section-title">Latest Activity</h3>
            <Link
                to={`/activities/${activity.id}`}
                className="latest-activity-card"
                state={{ shouldReturnToAllActivities: false }}
            >
                {activity.image && (
                    <img
                        src={activity.image}
                        alt={activity.title}
                        className="latest-activity-image"
                    />
                )}
                <div className="latest-activity-body">
                    <h2 className="latest-activity-title">{activity.title}</h2>
                    <p className="latest-activity-date">{activity.date}</p>
                    <p className="latest-activity-description">
                        {activity.description}
                    </p>
                </div>
            </Link>
            <div className="view-all-container">
                <Link to="/all-activities" className="view-all-button">
                    View All Activities →
                </Link>
            </div>
        </div>
    );
};

export default LatestActivity;
