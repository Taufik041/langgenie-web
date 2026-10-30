type Day = { day: string; requests: number; seconds: number };

/** Minimal accessible bar chart: audio minutes per day. */
export function UsageChart({ data }: { data: Day[] }) {
  const max = Math.max(1, ...data.map((d) => d.seconds));
  return (
    <div>
      <div className="flex h-40 items-end gap-1.5" role="img" aria-label="Audio processed per day">
        {data.map((d) => (
          <div key={d.day} className="group relative flex h-full flex-1 items-end">
            <div className="w-full rounded-t-[4px] bg-saffron/85 transition-colors group-hover:bg-saffron" style={{ height: `${Math.max(d.seconds ? 4 : 1.5, (d.seconds / max) * 100)}%`, opacity: d.seconds ? 1 : 0.25 }} />
            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border bg-popover px-2 py-1 text-xs shadow-md group-hover:block">
              <b>{new Date(d.day).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</b> · {d.requests} req · {(d.seconds / 60).toFixed(1)} min
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
        <span>{new Date(data[0].day).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
        <span>Today</span>
      </div>
    </div>
  );
}
