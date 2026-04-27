const styles = {
  NORMAL: 'bg-normal/20 text-normal ring-normal/30',
  WARNING: 'bg-warning/20 text-warning ring-warning/30',
  CRITICAL: 'bg-critical/20 text-critical ring-critical/30',
}

export default function HealthIndicator({ status, score, latencyMs }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">System Health</h2>
        <span className={`rounded-full px-4 py-1 text-sm font-semibold ring-1 ${styles[status] || styles.NORMAL}`}>
          {status}
        </span>
      </div>
      <p className="mt-3 text-slate-300">Anomaly Score: {score.toFixed(4)}</p>
      <p className="mt-1 text-xs text-slate-400">API latency: {latencyMs} ms</p>
    </div>
  )
}
