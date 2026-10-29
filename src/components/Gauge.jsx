export default function Gauge({ value, min = -40, max = 40 }) {
  const clamped = Math.max(min, Math.min(max, value))
  const range = max - min
  const pct = (clamped - min) / range

  const cx = 120, cy = 118, r = 88
  const startAngle = -210
  const endAngle = 30
  const totalDeg = endAngle - startAngle

  function polarToXY(angleDeg, radius) {
    const rad = (angleDeg * Math.PI) / 180
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
  }

  function describeArc(start, end, radius) {
    const s = polarToXY(start, radius)
    const e = polarToXY(end, radius)
    const large = end - start > 180 ? 1 : 0
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`
  }

  const valueAngle = startAngle + pct * totalDeg

  // Soft gradient colors depending on balance
  const color = value < -10 ? '#f0567a' : value < 5 ? '#f2a516' : '#2fb67c'
  const needleEnd = polarToXY(valueAngle, 68)

  const label = value > 10 ? 'In harmonie' : value > 0 ? 'Licht overwicht' : value > -10 ? 'Zoekend evenwicht' : 'Nood aan rust'

  return (
    <div className="gauge-card">
      <div className="gauge-title">Innerlijke Balans</div>
      <svg viewBox="0 0 240 155" width="230" height="148">
        {/* Track */}
        <path d={describeArc(startAngle, endAngle, r)} fill="none" stroke="rgba(110,80,190,0.18)" strokeWidth="14" strokeLinecap="round" />
        {/* Value arc */}
        <path d={describeArc(startAngle, valueAngle, r)} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" opacity="0.85" />
        {/* Subtle glow on arc */}
        <path d={describeArc(startAngle, valueAngle, r)} fill="none" stroke={color} strokeWidth="22" strokeLinecap="round" opacity="0.08" />

        {/* Tick marks */}
        {[-40, -20, 0, 20, 40].map(tick => {
          const a = startAngle + ((tick - min) / range) * totalDeg
          const inner = polarToXY(a, r - 10)
          const outer = polarToXY(a, r + 2)
          const labelPos = polarToXY(a, r - 24)
          return (
            <g key={tick}>
              <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="rgba(110,80,190,0.45)" strokeWidth="1" />
              <text x={labelPos.x} y={labelPos.y} fill="rgba(110,80,190,0.63)" fontSize="9" textAnchor="middle" dominantBaseline="middle">{tick}</text>
            </g>
          )
        })}

        {/* Needle */}
        <line x1={cx} y1={cy} x2={needleEnd.x} y2={needleEnd.y} stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        <circle cx={cx} cy={cy} r="5" fill={color} opacity="0.9" />
        <circle cx={cx} cy={cy} r="9" fill={color} opacity="0.1" />
      </svg>
      <div className="gauge-value" style={{ color }}>{value > 0 ? '+' : ''}{value}</div>
      <div className="gauge-label">{label}</div>
    </div>
  )
}
