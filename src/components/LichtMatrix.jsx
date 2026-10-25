import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Label } from 'recharts'

const PALET = ['#e8a0b4', '#d4b896', '#b8a9d9', '#8bbfaa', '#9bc4e2', '#e6c987', '#c99bd1', '#a3c9a8', '#f0b7a1', '#9fb3d9', '#c7c3d6']

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const d = payload[0].payload
    return (
      <div style={{ background: '#1a1b26', border: '1px solid rgba(180,160,220,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 13, maxWidth: 220 }}>
        <div style={{ fontWeight: 500, marginBottom: 4, color: '#cfc0f0' }}>{d.omschrijving}</div>
        <div style={{ color: '#9b93b0', fontSize: 12 }}>Licht: {d.x} · Onbenut: {d.y}×/week</div>
        <div style={{ color: '#9b93b0', fontSize: 12 }}>Ideaal: {d.frequentieIdeaal}× · Actueel: {d.frequentieActueel}×</div>
        <div style={{ color: '#9b93b0', fontSize: 12, fontStyle: 'italic' }}>{d.categorie}</div>
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
      <h3 style={{ marginBottom: 16, fontSize: '0.72rem', color: 'rgba(180,160,220,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'Inter, sans-serif' }}>
        Lichtkaart — Energie versus onbenut potentieel
      </h3>
      {data.length === 0 ? (
        <div className="empty-state">Nog geen lichtbronnen vastgelegd.</div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={270}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(180,160,220,0.07)" />
              <XAxis type="number" dataKey="x" domain={[0, 11]} ticks={[1,2,3,4,5,6,7,8,9,10]}
                stroke="rgba(180,160,220,0.2)" tick={{ fill: 'rgba(180,160,220,0.3)', fontSize: 11 }}>
                <Label value="Lichtsterkte" offset={-12} position="insideBottom" fill="rgba(180,160,220,0.3)" fontSize={11} />
              </XAxis>
              <YAxis type="number" dataKey="y" stroke="rgba(180,160,220,0.2)" tick={{ fill: 'rgba(180,160,220,0.3)', fontSize: 11 }}>
                <Label value="Onbenut ×/wk" angle={-90} position="insideLeft" fill="rgba(180,160,220,0.3)" fontSize={11} />
              </YAxis>
              <ZAxis type="number" dataKey="frequentieIdeaal" range={[60, 360]} name="Ideaal" />
              <ReferenceLine y={0} stroke="rgba(180,160,220,0.15)" strokeDasharray="4 4" />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'rgba(180,160,220,0.2)' }} />
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
              <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(180,160,220,0.4)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: kleur(c), display: 'inline-block' }} />
                {c}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(180,160,220,0.35)', marginTop: 8 }}>
            Bubbelgrootte = gewenste frequentie per week. Rechtsonder: veel licht, nog weinig gedaan.
          </div>
        </>
      )}
    </div>
  )
}
