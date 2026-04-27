export default function SensorCard({ title, value, unit }) {
  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-100">
        {Number(value).toFixed(2)} <span className="text-base text-slate-400">{unit}</span>
      </p>
    </div>
  )
}
