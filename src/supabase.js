import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://ecammtekgadserzwaiza.supabase.co',
  'sb_publishable_QegWJGfUZY_8nKhugJiPjw_NxR4pKoE'
)

// ── Lasten ────────────────────────────────────────────────
export async function fetchLasten(userId) {
  const { data, error } = await supabase
    .from('lasten')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function insertLast(userId, last) {
  const { data, error } = await supabase
    .from('lasten')
    .insert({ user_id: userId, ...last })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateLastStatus(id, status) {
  const { error } = await supabase
    .from('lasten')
    .update({ status })
    .eq('id', id)
  if (error) throw error
}

export async function deleteLast(id) {
  const { error } = await supabase.from('lasten').delete().eq('id', id)
  if (error) throw error
}

// ── Lichtbronnen ──────────────────────────────────────────
export async function fetchLichtbronnen(userId) {
  const { data, error } = await supabase
    .from('lichtbronnen')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data.map(dbToLicht)
}

export async function insertLicht(userId, licht) {
  const { data, error } = await supabase
    .from('lichtbronnen')
    .insert({ user_id: userId, ...lichtToDB(licht) })
    .select()
    .single()
  if (error) throw error
  return dbToLicht(data)
}

export async function deleteLicht(id) {
  const { error } = await supabase.from('lichtbronnen').delete().eq('id', id)
  if (error) throw error
}

// snake_case (DB) ↔ camelCase (JS)
function lichtToDB(l) {
  return {
    omschrijving:     l.omschrijving,
    lichtsterkte:     l.lichtsterkte,
    frequentie_ideaal:  l.frequentieIdeaal,
    frequentie_actueel: l.frequentieActueel,
    categorie:        l.categorie,
  }
}

function dbToLicht(row) {
  return {
    ...row,
    frequentieIdeaal:  row.frequentie_ideaal,
    frequentieActueel: row.frequentie_actueel,
  }
}
