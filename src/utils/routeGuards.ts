import { redirect } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'

// Blocks client-role users (and signed-out users) from internal/admin pages.
export async function requireAdmin({ location }: { location: { href: string } }) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    throw redirect({ to: '/login', search: { redirect: location.href } })
  }

  const [{ data: roleData }, { data: clientData }] = await Promise.all([
    supabase.from('user_roles').select('role').eq('user_id', session.user.id).maybeSingle(),
    supabase.from('clients').select('id').eq('user_id' as any, session.user.id).maybeSingle(),
  ])

  if (clientData || roleData?.role !== 'admin') {
    throw redirect({ to: '/portal' })
  }
}
