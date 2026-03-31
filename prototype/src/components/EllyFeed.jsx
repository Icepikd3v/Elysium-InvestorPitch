import React, { useEffect, useRef } from "react";

export default function EllyFeed({ personaLabel, feed, running }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [feed.length]);

  return (
    <section className="panel">
      <div className="panel-head">
        <h3>Elly (AI Brain Assistant)</h3>
        <div className="muted">
          Persona detected: <b>{personaLabel || "None"}</b>
        </div>
      </div>

      <div className="feed">
        {running && (
          <div className="feed-chip subtle">
            AI Brain: Generating recommendations in real time…
          </div>
        )}
        {feed.map((msg, idx) => (
          <div key={idx} className="feed-chip">
            {msg}
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </section>
  );
}
