// Synchronisation Supabase : compte, données (table `etats`) et photos (bucket `photos`).
// Sans configuration (.env), l'app fonctionne uniquement en local.
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const cle = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase = url && cle ? createClient(url, cle) : null

export async function lireCloud(userId: string): Promise<{ contenu: any; maj: number } | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from('etats').select('contenu, maj').eq('user_id', userId).maybeSingle()
  if (error) throw error
  return data ? { contenu: data.contenu, maj: new Date(data.maj).getTime() } : null
}

export async function ecrireCloud(userId: string, contenu: unknown, maj: number) {
  if (!supabase) return
  const { error } = await supabase.from('etats').upsert({ user_id: userId, contenu, maj: new Date(maj).toISOString() })
  if (error) throw error
}

/** Envoie une image (data URL) dans le bucket `photos` et renvoie son URL ; sans compte, renvoie la data URL. */
export async function televerserImage(dataUrl: string): Promise<string> {
  if (!supabase) return dataUrl
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return dataUrl
  try {
    const blob = await (await fetch(dataUrl)).blob()
    const ext = blob.type === 'image/png' ? 'png' : 'jpg'
    const chemin = `${session.user.id}/${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage.from('photos').upload(chemin, blob, { contentType: blob.type })
    if (error) throw error
    return supabase.storage.from('photos').getPublicUrl(chemin).data.publicUrl
  } catch (e) {
    console.error('Envoi de la photo impossible, conservée en local', e)
    return dataUrl
  }
}
