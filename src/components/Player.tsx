import React from "react";

const Player: React.FC = () => {
  return (
    <div className="player">
      <button className="play-btn" aria-label="Play stream">▶</button>
      <div className="player-meta">
        <div className="freq">14.150 MHz</div>
        <div className="now">Live: Sunday CW Practice</div>
      </div>
    </div>
  );
};

export default Player;
