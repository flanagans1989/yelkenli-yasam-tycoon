const IS_DEV = import.meta.env.DEV;

const STALE_THRESHOLD_MS = 90_000;
const CHECK_INTERVAL_MS = 30_000;
const MAX_LOG_SIZE = 200;

export type CadenceEventType =
  | "content_published"
  | "route_completed"
  | "sea_decision"
  | "upgrade_started"
  | "upgrade_completed"
  | "level_up"
  | "achievement"
  | "followers_milestone"
  | "daily_goal"
  | "sponsor_offer"
  | "sponsor_accepted";

type CadenceEvent = {
  type: CadenceEventType;
  timestamp: number;
  detail?: string;
};

const eventLog: CadenceEvent[] = [];
let checkIntervalId: ReturnType<typeof setInterval> | null = null;

function checkCadence() {
  if (eventLog.length === 0) return;
  const now = Date.now();
  const last = eventLog[eventLog.length - 1];
  const elapsedSec = Math.round((now - last.timestamp) / 1000);
  if (now - last.timestamp > STALE_THRESHOLD_MS) {
    console.warn(
      `[Cadence] ⚠️ No progression in ${elapsedSec}s — last: ${last.type}${last.detail ? ` (${last.detail})` : ""}`
    );
  }
}

export function startCadenceMonitor(): void {
  if (!IS_DEV || checkIntervalId !== null) return;
  checkIntervalId = setInterval(checkCadence, CHECK_INTERVAL_MS);
  console.info("[Cadence] Monitor started. Use window.__cadence.report() to inspect.");
}

export function stopCadenceMonitor(): void {
  if (checkIntervalId !== null) {
    clearInterval(checkIntervalId);
    checkIntervalId = null;
  }
}

export function trackCadenceEvent(type: CadenceEventType, detail?: string): void {
  if (!IS_DEV) return;
  const event: CadenceEvent = { type, timestamp: Date.now(), detail };
  eventLog.push(event);
  if (eventLog.length > MAX_LOG_SIZE) eventLog.shift();
  console.debug(`[Cadence] ✅ ${type}${detail ? ` · ${detail}` : ""}`);
}

function getCadenceReport() {
  const now = Date.now();
  const counts: Record<string, number> = {};
  let stalePeriods = 0;

  for (let i = 0; i < eventLog.length; i++) {
    counts[eventLog[i].type] = (counts[eventLog[i].type] ?? 0) + 1;
    if (i > 0 && eventLog[i].timestamp - eventLog[i - 1].timestamp > STALE_THRESHOLD_MS) {
      stalePeriods++;
    }
  }

  const lastEvent = eventLog[eventLog.length - 1];

  return {
    totalEvents: eventLog.length,
    sessionDurationSec: eventLog.length > 0 ? Math.round((now - eventLog[0].timestamp) / 1000) : 0,
    lastEventSecAgo: lastEvent ? Math.round((now - lastEvent.timestamp) / 1000) : null,
    stalePeriods,
    eventCounts: counts,
    recentEvents: eventLog.slice(-10).map((e) => ({
      type: e.type,
      detail: e.detail,
      secAgo: Math.round((now - e.timestamp) / 1000),
    })),
  };
}

if (IS_DEV) {
  (window as any).__cadence = {
    report: getCadenceReport,
    log: () => eventLog.slice(),
    stop: stopCadenceMonitor,
  };
}
