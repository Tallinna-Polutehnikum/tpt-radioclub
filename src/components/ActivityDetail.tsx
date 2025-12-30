import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getActivityById } from "../database/activities";
import type { Activity } from "./Activities";

const ActivityDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const [activity, setActivity] = useState({} as Activity);

    useEffect(() => {
        const fetchActivity = async () => {
            if (id) {
                const data = await getActivityById(id);
                if (!data) return;
                setActivity(data);
            }
        };
        fetchActivity();
    }, [id]);

    if (!activity) {
        return (
            <div className="activity-detail">
                <h2>Activity not found</h2>
                <Link to="/activities" className="back-link">
                    ← Back to Activities
                </Link>
            </div>
        );
    }

    return (
        <div className="activity-detail">
            <Link
                to={
                    location.state.shouldReturnToAllActivities
                        ? "/all-activities"
                        : "/activities"
                }
                className="back-link"
            >
                ← Back to Activities
            </Link>
            <div className="activity-header">
                <img src={activity.image} alt={activity.title} />
                <div>
                    <h1>{activity.title}</h1>
                    <p className="activity-date">{activity.date}</p>
                </div>
            </div>
            <div
                className="activity-content"
                dangerouslySetInnerHTML={{ __html: activity.content }}
            ></div>
        </div>
    );
};

export default ActivityDetail;
