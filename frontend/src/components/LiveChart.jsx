import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts'

export default function LiveChart({ data }) {
  return (
    <div className="glass rounded-2xl p-4">
      <h2 className="mb-4 text-lg font-medium">Live Sensor Streams</h2>
      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#cbd5e1" minTickGap={20} />
            <YAxis stroke="#cbd5e1" />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
            <Legend />
            <Line type="monotone" dataKey="acceleration" stroke="#38bdf8" dot={false} />
            <Line type="monotone" dataKey="strain" stroke="#a78bfa" dot={false} />
            <Line type="monotone" dataKey="displacement" stroke="#f59e0b" dot={false} />
            <Line type="monotone" dataKey="temperature" stroke="#34d399" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
