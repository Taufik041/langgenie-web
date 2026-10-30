import "server-only";
import { read } from "./db";
import { MODELS } from "./models";

export async function getUsage(userId: string, days = 14) {
  const db = await read();
  const events = db.usage.filter((u) => u.userId === userId);
  const since = Date.now() - days * 864e5;
  const recent = events.filter((e) => new Date(e.at).getTime() >= since);
  const byDay = Array.from({ length: days }, (_, i) => {
    const d = new Date(Date.now() - (days - 1 - i) * 864e5);
    const key = d.toISOString().slice(0, 10);
    const dayEvents = recent.filter((e) => e.at.slice(0, 10) === key);
    return { day: key, requests: dayEvents.length, seconds: dayEvents.reduce((s, e) => s + e.seconds, 0) };
  });
  const byModel = MODELS.map((m) => {
    const ev = events.filter((e) => e.model === m.id);
    const seconds = ev.reduce((s, e) => s + e.seconds, 0);
    return { model: m, requests: ev.length, seconds, cost: (seconds / 3600) * m.pricePerHour };
  });
  const keys = db.apiKeys.filter((k) => k.userId === userId && !k.revokedAt).length;
  return {
    total: events.length,
    seconds: events.reduce((s, e) => s + e.seconds, 0),
    cost: byModel.reduce((s, m) => s + m.cost, 0),
    keys,
    byDay,
    byModel,
    recent: [...events].reverse().slice(0, 20),
  };
}
