import React from "react";
import { useParams, Link } from "react-router-dom";
import type { Activity } from "./Activities";
import { useLocation } from "react-router-dom";
import activities from "../assets/activites.json";


const activityData = parseActivitiesArray(activities);

function parseActivitiesArray(
    arr: Activity[]
): Record<string, { title: string; date: string; content: string; image: string }> {
    return arr.reduce((acc, curr) => {
        acc[curr.id] = {
            title: curr.title,
            date: curr.date,
            content: curr.content,
            image: curr.image
        };
        return acc;
    }, {} as Record<string, { title: string; date: string; content: string; image: string }>);
}

const ActivityDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const activity = activityData[id || ""];

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
            <Link to={location.state.shouldReturnToAllActivities ? "/all-activities" : "/activities"} className="back-link">
                ← Back to Activities
            </Link>
            <div className="activity-header">
                <img src={activity.image} alt={activity.title} />
                <div>
                    <h1>{activity.title}</h1>
                    <p className="activity-date">{activity.date}</p>
                </div>
            </div>
            <div className="activity-content" dangerouslySetInnerHTML={{ __html: activity.content }}>
            </div>
        </div>
    );
};

export default ActivityDetail;
