import { createFileRoute } from '@tanstack/react-router'
import { ClientDetailPage } from '../components/clients/ClientDetailPage'
import { requireAdmin } from '@/utils/routeGuards'

export const Route = createFileRoute('/clients/$id')({
  beforeLoad: requireAdmin,
  component: ClientDetailPage,
})
