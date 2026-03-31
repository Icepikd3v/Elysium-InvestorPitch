import { useEffect, useMemo, useRef, useState } from "react";

export default function RetinaScan({
  onComplete,
  onUsePasswordLogin,
  autoStart = false,
  hidePasswordOption = false,
}) {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);

  const seed = useMemo(() => {
    // deterministic-ish seed for demo flavor (changes on refresh)
    return Math.random().toString(16).slice(2);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!autoStart || running) return;
    start();
  }, [autoStart, running]);

  const start = () => {
    if (running) return;
    setRunning(true);
    setProgress(0);

    const startTs = performance.now();
    const duration = 2200; // ~2.2s feels snappy for investors

    const tick = (ts) => {
      const t = Math.min(1, (ts - startTs) / duration);
      // ease-out
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // tiny pause to feel like a “match”
        setTimeout(() => {
          onComplete?.({ seed });
        }, 250);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  return (
    <div className="scanWrap">
      <div className="scanBox">
        <div className="scanHeader">
          <h1>Elysium • Retina Scan</h1>
          <p>
            {autoStart
              ? "Credentials accepted • running retina verification"
              : "Retina scan simulation • Investor demo"}
          </p>
        </div>

        <div className="scanStage">
          <div className={`retinaRing ${running ? "running" : ""}`}>
            <div className="retinaInner" />
            <div className="scanLine" />
          </div>

          <div className="scanMeta">
            <div className="scanProgressRow">
              <div className="scanLabel">Scanning retina…</div>
              <div className="scanPct">{progress}%</div>
            </div>

            <div className="scanBar">
              <div className="scanBarFill" style={{ width: `${progress}%` }} />
            </div>

            <div className="scanBtns">
              <button
                className="btn primary"
                onClick={start}
                disabled={running || autoStart}
              >
                {running ? "Scanning…" : autoStart ? "Auto Scan Enabled" : "Start Scan"}
              </button>

              {!hidePasswordOption ? (
                <button
                  className="btn"
                  onClick={onUsePasswordLogin}
                  disabled={running}
                >
                  Use password login
                </button>
              ) : null}
            </div>

            <p className="muted" style={{ marginTop: 10 }}>
              {autoStart
                ? "This simulated scan runs automatically after sign-in before demo access is granted."
                : "This is a simulated scan for investors. Live version will use real biometric auth."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
