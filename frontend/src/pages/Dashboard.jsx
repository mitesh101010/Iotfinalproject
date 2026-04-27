import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import SensorCard from '../components/SensorCard'
import LiveChart from '../components/LiveChart'
import HealthIndicator from '../components/HealthIndicator'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

export default function Dashboard() {
  const [latest, setLatest] = useState(null)
  const [prediction, setPrediction] = useState({ score: 0, status: 'NORMAL' })
  const [history, setHistory] = useState([])
  const [latency, setLatency] = useState(0)

  useEffect(() => {
    let active = true

    const poll = async () => {
      const start = performance.now()
      try {
        const [dataRes, predRes, histRes] = await Promise.all([
          axios.get(`${API_BASE}/data`),
          axios.get(`${API_BASE}/predict`),
          axios.get(`${API_BASE}/history`),
        ])
        if (!active) return

        setLatency(Math.round(performance.now() - start))
        setLatest(dataRes.data)
        setPrediction(predRes.data)
        setHistory(histRes.data)
      } catch (error) {
        console.error('Polling error:', error)
      }
    }

    poll()
    const interval = setInterval(poll, 1000)
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  const chartData = useMemo(
    () =>
      history.map((item) => ({
        ...item,
        time: new Date(item.timestamp).toLocaleTimeString(),
      })),
    [history],
  )

  return (
    <div className="space-y-6">
      <HealthIndicator status={prediction.status} score={prediction.score || 0} latencyMs={latency} />

      {prediction.status === 'CRITICAL' && (
        <div className="rounded-2xl border border-critical/40 bg-critical/15 p-4 text-critical">
          🚨 Abnormal structural behavior detected
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SensorCard title="Acceleration" value={latest?.acceleration ?? 0} unit="g" />
        <SensorCard title="Strain" value={latest?.strain ?? 0} unit="με" />
        <SensorCard title="Displacement" value={latest?.displacement ?? 0} unit="mm" />
        <SensorCard title="Temperature" value={latest?.temperature ?? 0} unit="°C" />
      </div>

      <LiveChart data={chartData} />
    </div>
  )
}
