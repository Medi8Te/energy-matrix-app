import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Label } from 'recharts'

const PALET = ['#f0567a', '#f2a516', '#8b6fd6', '#2fb67c', '#3fa9f5', '#ffc93c', '#c25fd6', '#7cc95a', '#ff8a5b', '#5b7fe0', '#a99bb8']

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const d = payload[0].payload
    return (
      <div style={{ background: '#ffffff', border: '1px solid rgba(110,80,190,0.36)', borderRadius: 10, padding: '10px 14px', fontSize: 13, maxWidth: 220 }}>
        <div style={{ fontWeight: 500, marginBottom: 4, color: '#5b3fb8' }}>{d.omschrijving}</div>
        <div style={{ color: '#6e5d7e', fontSize: 12 }}>Licht: {d.x} · Onbenut: {d.y}×/week</div>
        <div style={{ color: '#6e5d7e', fontSize: 12 }}>Ideaal: {d.frequentieIdeaal}× · Actueel: {d.frequentieActueel}×</div>
        <div style={{ color: '#6e5d7e', fontSize: 12, fontStyle: 'italic' }}>{d.categorie}</div>
      </div>
    )
  }
  return null
}

export default function LichtMatrix({ lichtbronnen }) {
  const data = lichtbronnen.map(l => ({
    ...l,
    x: l.lichtsterkte,
    y: l.frequentieIdeaal - l.frequentieActueel,
  }))

  const categorieen = [...new Set(data.map(d => d.categorie))].sort()
  const kleur = c => PALET[categorieen.indexOf(c) % PALET.length]

  return (
    <div className="card">
      <h3 style={{ marginBottom: 16, fontSize: '0.72rem', color: 'rgba(110,80,190,0.72)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'Inter, sans-serif' }}>
        Lichtkaart — Energie versus onbenut potentieel
      </h3>
      {data.length === 0 ? (
        <div className="empty-state">Nog geen lichtbronnen vastgelegd.</div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={270}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(110,80,190,0.13)" />
              <XAxis type="number" dataKey="x" domain={[0, 11]} ticks={[1,2,3,4,5,6,7,8,9,10]}
                stroke="rgba(110,80,190,0.36)" tick={{ fill: 'rgba(110,80,190,0.54)', fontSize: 11 }}>
                <Label value="Lichtsterkte" offset={-12} position="insideBottom" fill="rgba(110,80,190,0.54)" fontSize={11} />
              </XAxis>
              <YAxis type="number" dataKey="y" stroke="rgba(110,80,190,0.36)" tick={{ fill: 'rgba(110,80,190,0.54)', fontSize: 11 }}>
                <Label value="Onbenut ×/wk" angle={-90} position="insideLeft" fill="rgba(110,80,190,0.54)" fontSize={11} />
              </YAxis>
              <ZAxis type="number" dataKey="frequentieIdeaal" range={[60, 360]} name="Ideaal" />
              <ReferenceLine y={0} stroke="rgba(110,80,190,0.27)" strokeDasharray="4 4" />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'rgba(110,80,190,0.36)' }} />
              {categorieen.map(cat => {
                const subset = data.filter(d => d.categorie === cat)
                return (
                  <Scatter key={cat} name={cat} data={subset} fill={kleur(cat)} fillOpacity={0.7} />
                )
              })}
            </ScatterChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
            {categorieen.map(c => (
              <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(110,80,190,0.72)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: kleur(c), display: 'inline-block' }} />
                {c}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(110,80,190,0.63)', marginTop: 8 }}>
            Bubbelgrootte = gewenste frequentie per week. Rechtsonder: veel licht, nog weinig gedaan.
          </div>
        </>
      )}
    </div>
  )
}
