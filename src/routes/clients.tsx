import { createFileRoute } from '@tanstack/react-router'
import { ClientsPage } from '../components/clients/ClientsPage'
import { requireAdmin } from '@/utils/routeGuards'

export const Route = createFileRoute('/clients')({
  beforeLoad: requireAdmin,
  component: ClientsPage,
})
