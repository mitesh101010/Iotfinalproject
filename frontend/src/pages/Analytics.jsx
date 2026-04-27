import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

function movingAverage(values, windowSize = 8) {
  return values.map((_, index) => {
    const start = Math.max(0, index - windowSize + 1)
    const window = values.slice(start, index + 1)
    return window.reduce((sum, n) => sum + n, 0) / window.length
  })
}

export default function Analytics() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/history`)
        setHistory(res.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 2000)
    return () => clearInterval(interval)
  }, [])

  const chartData = useMemo(() => {
    const tempSeries = history.map((item) => item.temperature)
    const trend = movingAverage(tempSeries)

    return history.map((item, idx) => ({
      time: new Date(item.timestamp).toLocaleTimeString(),
      strain: item.strain,
      displacement: item.displacement,
      temperature: item.temperature,
      tempForecast: trend[idx] || item.temperature,
    }))
  }, [history])

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-4">
        <h2 className="mb-3 text-lg font-medium">Strain & Displacement Trends</h2>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#cbd5e1" minTickGap={20} />
              <YAxis stroke="#cbd5e1" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
              <Area type="monotone" dataKey="strain" stroke="#a78bfa" fill="#a78bfa33" />
              <Area type="monotone" dataKey="displacement" stroke="#f59e0b" fill="#f59e0b33" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <h2 className="mb-3 text-lg font-medium">Temperature + Moving Average Forecast</h2>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#cbd5e1" minTickGap={20} />
              <YAxis stroke="#cbd5e1" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
              <Area type="monotone" dataKey="temperature" stroke="#34d399" fill="#34d39933" />
              <Area type="monotone" dataKey="tempForecast" stroke="#38bdf8" fill="#38bdf822" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
