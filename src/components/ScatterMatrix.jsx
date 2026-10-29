import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Label } from 'recharts'

const STATUS_COLOR = {
  aanwezig:    '#f0567a',
  'in beweging': '#f2a516',
  omarmd:      '#8b6fd6',
  losgelaten:  '#cfc4da',
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const d = payload[0].payload
    return (
      <div style={{ background: '#ffffff', border: '1px solid rgba(110,80,190,0.36)', borderRadius: 10, padding: '10px 14px', fontSize: 13, maxWidth: 220 }}>
        <div style={{ fontWeight: 500, marginBottom: 4, color: '#5b3fb8' }}>{d.omschrijving}</div>
        <div style={{ color: '#6e5d7e', fontSize: 12 }}>Kans: {d.x} · Impact: {d.y}</div>
        <div style={{ color: '#6e5d7e', fontSize: 12 }}>Gewicht: {d.gewicht}</div>
        <div style={{ color: '#6e5d7e', fontSize: 12, marginTop: 2, fontStyle: 'italic' }}>{d.status}</div>
      </div>
    )
  }
  return null
}

export default function ScatterMatrix({ lasten }) {
  const data = lasten.map(l => ({ ...l, x: l.waarschijnlijkheid, y: l.impact }))

  return (
    <div className="card">
      <h3 style={{ marginBottom: 16, fontSize: '0.72rem', color: 'rgba(110,80,190,0.72)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'Inter, sans-serif' }}>
        Zorgenkaart — Kans versus Impact
      </h3>
      {data.length === 0 ? (
        <div className="empty-state">Nog geen zorgen vastgelegd. Breng je zorgen in kaart via ☁️ Zorgen.</div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={270}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(110,80,190,0.13)" />
              <XAxis type="number" dataKey="x" domain={[0, 11]} ticks={[1,2,3,4,5,6,7,8,9,10]}
                stroke="rgba(110,80,190,0.36)" tick={{ fill: 'rgba(110,80,190,0.54)', fontSize: 11 }}>
                <Label value="Waarschijnlijkheid" offset={-12} position="insideBottom" fill="rgba(110,80,190,0.54)" fontSize={11} />
              </XAxis>
              <YAxis type="number" dataKey="y" domain={[0, 11]} ticks={[1,2,3,4,5,6,7,8,9,10]}
                stroke="rgba(110,80,190,0.36)" tick={{ fill: 'rgba(110,80,190,0.54)', fontSize: 11 }}>
                <Label value="Impact" angle={-90} position="insideLeft" fill="rgba(110,80,190,0.54)" fontSize={11} />
              </YAxis>
              <ReferenceLine x={5.5} stroke="rgba(110,80,190,0.14)" strokeDasharray="4 4" />
              <ReferenceLine y={5.5} stroke="rgba(110,80,190,0.14)" strokeDasharray="4 4" />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'rgba(110,80,190,0.36)' }} />
              {Object.keys(STATUS_COLOR).map(status => {
                const subset = data.filter(d => d.status === status)
                if (subset.length === 0) return null
                return (
                  <Scatter key={status} name={status} data={subset} fill={STATUS_COLOR[status]} opacity={0.8} r={6} />
                )
              })}
            </ScatterChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
            {Object.entries(STATUS_COLOR).map(([s, c]) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(110,80,190,0.72)', textTransform: 'capitalize' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }} />
                {s}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
