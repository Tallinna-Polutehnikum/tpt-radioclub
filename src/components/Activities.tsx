import React from "react";
import { Link } from "react-router-dom";
import activities from "../assets/activites.json";

export interface Activity {
    id: string;
    title: string;
    date: string;
    description: string;
    image: string;
    content: string;
}

const Activities: React.FC = () => (
    <section className="newsabout">
        <div className="col news" id="activities">
            <h3 className="section-title">Latest Activities</h3>
            {activities.slice(0,3).map((act) => (
                <Link
                    to={`/activities/${act.id}`}
                    key={act.id}
                    className="activity-card"
                    state={{ shouldReturnToActivities: false }}
                >
                    <div className="activity-info">
                        <h2>{act.title}</h2>
                        <p className="activity-date">{act.date}</p>
                        <p className="activity-description">{act.description}</p>
                    </div>
                </Link>
            ))}
            <div className="view-all-container">
                <Link to="/all-activities" className="view-all-button">
                    View All Activities →
                </Link>
            </div>
        </div>

        <div className="col about" id="about">
            <h3 className="section-title">Latest QSOs</h3>
            <iframe
                frameBorder="0"
                height="500"
                src="https://logbook.qrz.com/lbstat/ES1TP/"
                width="640"
                style={{ display: "block", margin: "0 auto", verticalAlign: "top" }}
            ></iframe>
        </div>
    </section>
);

export default Activities;
