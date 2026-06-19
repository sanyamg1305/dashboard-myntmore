import { createFileRoute } from '@tanstack/react-router'
import { SettingsPage } from '../components/settings/SettingsPage'
import { requireAdmin } from '@/utils/routeGuards'

export const Route = createFileRoute('/settings')({
  beforeLoad: requireAdmin,
  component: SettingsPage,
})
