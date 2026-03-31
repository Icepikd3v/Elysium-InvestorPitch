import { useEffect, useState } from "react";

const IDLE_ACTIVITY_BATCHES = [
  {
    cues: [
      "Gazes 30 seconds, interested",
      "Fits within budget and past purchase amounts",
      "Color is client's preference",
      "Recommend similar items, not trying on",
    ],
    mode: "thinking",
    showMs: 3000,
  },
  {
    cues: [
      "Clicked, liked",
      "Suggest similar shades",
      "Smile is interest",
      "Looking around, unsure",
    ],
    mode: "thinking",
    showMs: 2000,
  },
  {
    cues: [
      "Smile, yes",
      "Shake, no",
      "Linger, suggest",
      "Recommend",
    ],
    mode: "recommending",
    showMs: 1000,
  },
];

const EMOTE_IMAGE = {
  idle: "/elly/elly_idle.png",
  listening: "/elly/elly_thinking.png",
  searching: "/elly/elly_searching.png",
  thinking: "/elly/elly_thinking.png",
  recommending: "/elly/elly_recommending.png",
};

export default function BrainCueWidget({
  cuePacket,
  active = true,
  side = "right",
  avoidPanel = false,
}) {
  const [queue, setQueue] = useState([]);
  const [currentBatch, setCurrentBatch] = useState(null);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [pulseOn, setPulseOn] = useState(false);
  const [spriteReady, setSpriteReady] = useState(false);
  const [activeMode, setActiveMode] = useState("idle");
  const [idleBatchIndex, setIdleBatchIndex] = useState(0);

  const canProcess = active;

  useEffect(() => {
    const urls = Object.values(EMOTE_IMAGE);
    let loaded = 0;
    let failed = false;

    urls.forEach((url) => {
      const img = new Image();
      img.onload = () => {
        loaded += 1;
        if (loaded === urls.length && !failed) setSpriteReady(true);
      };
      img.onerror = () => {
        failed = true;
        setSpriteReady(false);
      };
      img.src = url;
    });
  }, []);

  useEffect(() => {
    if (!cuePacket || !cuePacket.id) return;

    const cues = (cuePacket.cues || []).filter(Boolean).slice(0, 4);
    if (!cues.length) return;

    setQueue((prev) =>
      [
        ...prev,
        ...cues.map((cue, index) => ({
          id: `${cuePacket.id}-cue-${index}`,
          cues: [cue],
          mode: cuePacket.mode || "thinking",
          showMs: cuePacket.showMs || 1400,
        })),
      ].slice(-12),
    );
  }, [cuePacket]);

  useEffect(() => {
    if (!canProcess) return;
    if (currentBatch || queue.length === 0) return;

    const [next, ...rest] = queue;
    setQueue(rest);
    setCurrentBatch(next);
  }, [queue, currentBatch, canProcess]);

  // Low-frequency ambient AI activity while idle.
  useEffect(() => {
    if (!canProcess || currentBatch || queue.length > 0) return;

    const idleTimer = setTimeout(() => {
      const nextIdle =
        IDLE_ACTIVITY_BATCHES[idleBatchIndex % IDLE_ACTIVITY_BATCHES.length];
      if (!nextIdle) return;

      setQueue((prev) =>
        [
          ...prev,
          ...nextIdle.cues.slice(0, 4).map((cue, index) => ({
            id: `idle-ambient-${idleBatchIndex}-${index}-${Date.now()}`,
            cues: [cue],
            mode: nextIdle.mode,
            showMs: nextIdle.showMs,
          })),
        ].slice(-12),
      );
      setIdleBatchIndex((prev) => prev + 1);
    }, 450);

    return () => clearTimeout(idleTimer);
  }, [canProcess, currentBatch, queue.length, idleBatchIndex]);

  useEffect(() => {
    if (!currentBatch || !canProcess) return;

    const showMs = currentBatch.showMs || 1400;

    setBubbleVisible(true);
    setPulseOn(true);
    setActiveMode(currentBatch.mode || "thinking");

    const pulseTimer = setTimeout(() => setPulseOn(false), 420);
    const hideTimer = setTimeout(
      () => setBubbleVisible(false),
      Math.max(700, showMs - 220),
    );
    const doneTimer = setTimeout(() => {
      setCurrentBatch(null);
      setActiveMode("idle");
    }, showMs);

    return () => {
      clearTimeout(pulseTimer);
      clearTimeout(hideTimer);
      clearTimeout(doneTimer);
    };
  }, [currentBatch, canProcess]);

  const emoteImage = EMOTE_IMAGE[activeMode] || EMOTE_IMAGE.idle;
  const bubbleLines = currentBatch?.cues || [];

  return (
    <div
      className={`brainWidget brainWidget-${side}${avoidPanel ? " brainWidget-avoidPanel" : ""}`}
      aria-live="polite"
      role="status"
    >
      <div className={`brainOrb ${pulseOn ? "isPulse" : ""}`} aria-hidden="true">
        <span className="brainHalo" />
        {spriteReady ? (
          <div
            className={`ellyBrainSprite mode-${activeMode}`}
            style={{
              backgroundImage: `url(${emoteImage})`,
            }}
          />
        ) : (
          <svg
            className="brainGlyph"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23 16c-5.8 0-10 4.5-10 10.2 0 2.4.8 4.3 2.3 5.8-1.1 1.5-1.7 3.2-1.7 5 0 4.9 3.7 8.7 8.8 8.7 2.2 0 4.3-.7 5.9-2.2v-24c-1.2-2.3-3-3.5-5.3-3.5Z"
              className="brainStroke"
            />
            <path
              d="M41 16c5.8 0 10 4.5 10 10.2 0 2.4-.8 4.3-2.3 5.8 1.1 1.5 1.7 3.2 1.7 5 0 4.9-3.7 8.7-8.8 8.7-2.2 0-4.3-.7-5.9-2.2v-24c1.2-2.3 3-3.5 5.3-3.5Z"
              className="brainStroke"
            />
            <line x1="24" y1="24" x2="32" y2="29" className="brainWire" />
            <line x1="40" y1="24" x2="32" y2="29" className="brainWire" />
            <line x1="24" y1="38" x2="32" y2="33" className="brainWire" />
            <line x1="40" y1="38" x2="32" y2="33" className="brainWire" />
            <line x1="24" y1="24" x2="24" y2="38" className="brainWire" />
            <line x1="40" y1="24" x2="40" y2="38" className="brainWire" />
            <circle cx="24" cy="24" r="3.8" className="brainNodeDot" />
            <circle cx="40" cy="24" r="3.8" className="brainNodeDot" />
            <circle cx="24" cy="38" r="3.8" className="brainNodeDot" />
            <circle cx="40" cy="38" r="3.8" className="brainNodeDot" />
            <circle
              cx="32"
              cy="31"
              r="4.2"
              className="brainNodeDot brainNodeDotCore"
            />
          </svg>
        )}
      </div>

      <div className={`brainBubbleStack ${bubbleVisible ? "show" : ""}`}>
        {bubbleLines.map((line, idx) => (
          <div
            key={`${currentBatch?.id || "cue"}-${idx}`}
            className={`brainBubbleMono multi ${bubbleVisible ? "show" : ""}`}
            style={{ transitionDelay: bubbleVisible ? `${idx * 40}ms` : "0ms" }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
