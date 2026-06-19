import { createFileRoute } from '@tanstack/react-router'
import { ActionablesPage } from '../components/actionables/ActionablesPage'
import { requireAdmin } from '@/utils/routeGuards'

export const Route = createFileRoute('/actionables')({
  beforeLoad: requireAdmin,
  component: ActionablesPage,
})
