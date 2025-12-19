import React from "react";

const Player: React.FC = () => {
  return (
    <div className="player">
      <button className="play-btn" aria-label="Play stream" onClick={() => window.open('https://es4o.erau.ee/')}>▶</button>
      <div className="player-meta">
        <div className="freq">3.670 KHz</div>
        <div className="now">Every Saturday, 9:00 EET ERAU round table net</div>
      </div>
    </div>
  );
};

export default Player;
