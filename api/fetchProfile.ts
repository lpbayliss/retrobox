import { supabase } from "utils/supabaseClient"

export const fetchProfile = async (id: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`nickname, avatar_url`)
    .eq('id', id)
    .single()
  if (error) return [error]
  return [null, data];
}