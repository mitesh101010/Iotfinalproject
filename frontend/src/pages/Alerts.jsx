import { useEffect, useState } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

export default function Alerts() {
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/alerts`)
        setAlerts(res.data.slice().reverse())
      } catch (error) {
        console.error(error)
      }
    }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="glass rounded-2xl p-4">
      <h2 className="mb-4 text-lg font-medium">Anomaly Alerts</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-300">
            <tr>
              <th className="py-2">Timestamp</th>
              <th className="py-2">Status</th>
              <th className="py-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, idx) => (
              <tr key={`${alert.timestamp}-${idx}`} className="border-t border-slate-700/50">
                <td className="py-2 text-slate-300">{new Date(alert.timestamp).toLocaleString()}</td>
                <td className="py-2">
                  <span
                    className={`rounded px-2 py-1 text-xs font-semibold ${
                      alert.status === 'CRITICAL'
                        ? 'bg-critical/25 text-critical'
                        : 'bg-warning/25 text-warning'
                    }`}
                  >
                    {alert.status}
                  </span>
                </td>
                <td className="py-2 text-slate-300">{alert.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
