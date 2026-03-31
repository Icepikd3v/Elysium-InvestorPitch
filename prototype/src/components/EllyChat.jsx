import { useEffect, useMemo, useRef } from "react";

export default function EllyChat({
  personaLabel,
  activeStore,
  messageLog,
  brainSnapshot = null,
}) {
  const chatListRef = useRef(null);
  const liveFeedRef = useRef(null);
  const timelinePinnedRef = useRef(true);
  const liveFeedPinnedRef = useRef(true);
  const recentCueLines = (brainSnapshot?.cueLines || []).slice(0, 2);
  const liveActivity = useMemo(() => {
    const explicitActions = [];

    const cueLines = (brainSnapshot?.cueLines || []).slice(0, 6);
    cueLines.forEach((line, idx) => {
      explicitActions.push({
        key: `cue-${idx}-${line}`,
        label:
          idx === 0
            ? "Signal detected"
            : idx === 1
              ? "Behavior interpretation"
              : idx === 2
                ? "Recommendation update"
                : "AI processing step",
        text: line,
      });
    });

    if (brainSnapshot?.insight?.summary) {
      explicitActions.push({
        key: "summary",
        label: "Elly reasoning",
        text: brainSnapshot.insight.summary,
      });
    }

    const latestMessages = (messageLog || [])
      .slice(-22)
      .map((m, idx) => ({ key: `msg-${idx}-${m.ts || 0}`, text: m.text }))
      .filter(({ text }) => Boolean(text))
      .filter(
        ({ text }) =>
          text.includes("AI Brain:") ||
          text.includes("Elly:") ||
          text.includes("Virtual Mall:"),
      )
      .slice(-6)
      .reverse()
      .map(({ key, text }) => {
        if (text.startsWith("AI Brain:")) {
          const body = text.replace("AI Brain:", "").trim();
          let label = "AI Brain event";
          if (/retina|pupil/i.test(body)) label = "Biometric signal";
          else if (/cart/i.test(body)) label = "Cart intelligence";
          else if (/recommend|re-ranking|ranking/i.test(body))
            label = "Recommendation update";
          return {
            key,
            label,
            text: body,
          };
        }
        if (text.startsWith("Elly:")) {
          const body = text.replace("Elly:", "").trim();
          let label = "Elly action";
          if (/searching|search/i.test(body)) label = "Product search";
          else if (/fit|confidence|emotion|intent/i.test(body))
            label = "Behavior interpretation";
          else if (/dual-shopper|friend/i.test(body))
            label = "Social shopping sync";
          return {
            key,
            label,
            text: body,
          };
        }
        return {
          key,
          label: "Simulator event",
          text: text.replace("Virtual Mall:", "").trim(),
        };
      });

    return [...explicitActions, ...latestMessages].slice(0, 16);
  }, [messageLog, brainSnapshot]);

  useEffect(() => {
    const node = chatListRef.current;
    if (!node || !timelinePinnedRef.current) return;
    const frame = window.requestAnimationFrame(() => {
      node.scrollTop = node.scrollHeight;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [messageLog.length]);

  const handleTimelineScroll = () => {
    const node = chatListRef.current;
    if (!node) return;
    const threshold = 20;
    const distFromBottom = node.scrollHeight - node.clientHeight - node.scrollTop;
    timelinePinnedRef.current = distFromBottom <= threshold;
  };

  useEffect(() => {
    const node = liveFeedRef.current;
    if (!node || !liveFeedPinnedRef.current) return;
    const frame = window.requestAnimationFrame(() => {
      node.scrollTop = node.scrollHeight;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [liveActivity]);

  const handleLiveFeedScroll = () => {
    const node = liveFeedRef.current;
    if (!node) return;
    const threshold = 20;
    const distFromBottom = node.scrollHeight - node.clientHeight - node.scrollTop;
    liveFeedPinnedRef.current = distFromBottom <= threshold;
  };

  return (
    <div className="ellyChat">
      <p className="muted">
        Persona detected: <b>{personaLabel || "—"}</b>
        {activeStore ? (
          <>
            {" "}
            • Active store: <b>{activeStore}</b>
          </>
        ) : null}
      </p>

      {brainSnapshot ? (
        <div className="brainSyncCard">
          <div className="brainSyncHeader">
            <div>
              <div className="brainSyncTitle">AI Brain Event</div>
              <div className="brainSyncSub">
                {brainSnapshot.insight?.subtitle || "Live walkthrough state"} •{" "}
                {brainSnapshot.mode || "active"}
              </div>
            </div>
            <span className="brainSyncBadge">Synced</span>
          </div>

          {brainSnapshot.insight?.summary ? (
            <div className="brainSyncSummary">
              {brainSnapshot.insight.summary}
            </div>
          ) : null}

          {brainSnapshot.metrics ? (
            <div className="brainSyncMetrics">
              <div className="brainSyncMetric">
                <span>Scans</span>
                <b>{brainSnapshot.metrics.scans}</b>
              </div>
              <div className="brainSyncMetric">
                <span>Products</span>
                <b>{brainSnapshot.metrics.productScans}</b>
              </div>
              <div className="brainSyncMetric">
                <span>Emotion</span>
                <b>{brainSnapshot.metrics.emotionConfidence}%</b>
              </div>
              <div className="brainSyncMetric">
                <span>Budget</span>
                <b>{brainSnapshot.metrics.budgetFit}%</b>
              </div>
              <div className="brainSyncMetric">
                <span>Top Match</span>
                <b>{brainSnapshot.metrics.topMatchScore}%</b>
              </div>
            </div>
          ) : null}

          {recentCueLines.length ? (
            <div className="brainSyncList">
              {recentCueLines.map((line) => (
                <div key={line} className="brainSyncItem">
                  {line}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {!!(messageLog || []).length && (
        <div className="brainTimeline">
          <div className="brainTimelineHeader">Detailed Event Timeline ↓</div>
          <div
            ref={chatListRef}
            className="chatList"
            onScroll={handleTimelineScroll}
          >
            {messageLog.map((m, idx) => (
              <div key={`${m.ts || 0}-${idx}`} className="chatBubble">
                {m.text}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="brainLiveFeed">
        <div className="brainLiveFeedHeader">
          <span>Live Brain Actions</span>
          <span className="brainLivePulse">Updating</span>
        </div>
        <div
          ref={liveFeedRef}
          className="brainLiveFeedList"
          onScroll={handleLiveFeedScroll}
        >
          {liveActivity.length ? (
            liveActivity.map((item) => (
              <div key={item.key} className="brainLiveFeedItem">
                <div className="brainLiveFeedLabel">{item.label}</div>
                <div>{item.text}</div>
              </div>
            ))
          ) : (
            <div className="muted">
              Live AI reasoning will appear here while the simulator is in use.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
