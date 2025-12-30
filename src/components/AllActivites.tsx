import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllActivities } from "../database/activities";
import type { Activity } from "./Activities";

const AllActivities: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        const fetchActivities = async () => {
            const data = await getAllActivities();
            setActivities(data);
        };
        fetchActivities();
    }, []);

    return (
        <section className="page about">
            <h2>All Activities</h2>
            {activities.map((act) => (
                <Link
                    to={`/activities/${act.id}`}
                    key={act.id}
                    className="activity-card"
                    state={{ shouldReturnToAllActivities: true }}
                >
                    <div className="activity-info">
                        <h2>{act.title}</h2>
                        <p className="activity-date">{act.date}</p>
                        <p className="activity-description">
                            {act.description}
                        </p>
                    </div>
                </Link>
            ))}
        </section>
    );
};

export default AllActivities;
