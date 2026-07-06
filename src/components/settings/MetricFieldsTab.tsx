import React, { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { CONTENT_METRICS, LEADGEN_METRICS } from '@/data/metrics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

interface ClientRow {
  id: string
  name: string
  company: string | null
  status: string | null
}

interface Settings {
  id: string
  client_id: string | null
  active_content_metrics: string[] | null
  active_leadgen_metrics: string[] | null
}

export function MetricFieldsTab() {
  const [clients, setClients] = useState<ClientRow[]>([])
  const [settingsMap, setSettingsMap] = useState<Record<string, Settings>>({})
  const [loading, setLoading] = useState(true)
  const [selectedClient, setSelectedClient] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<'content' | 'leadgen'>('content')

  useEffect(() => {
    const load = async () => {
      const [{ data: clientsData }, { data: settingsData }] = await Promise.all([
        supabase.from('clients').select('id, name, company, status').eq('status', 'active').order('name'),
        supabase.from('client_settings').select('id, client_id, active_content_metrics, active_leadgen_metrics'),
      ])
      if (clientsData) {
        setClients(clientsData)
        if (clientsData.length > 0) setSelectedClient(clientsData[0].id)
      }
      if (settingsData) {
        const map: Record<string, Settings> = {}
        settingsData.forEach((s: Settings) => { if (s.client_id) map[s.client_id] = s })
        setSettingsMap(map)
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleToggle = async (clientId: string, metricId: string, category: 'content' | 'leadgen') => {
    const settings = settingsMap[clientId]
    if (!settings) return
    const field = category === 'content' ? 'active_content_metrics' : 'active_leadgen_metrics'
    const current = settings[field] || []
    const updated = current.includes(metricId)
      ? current.filter((m: string) => m !== metricId)
      : [...current, metricId]

    setSettingsMap(prev => ({
      ...prev,
      [clientId]: { ...prev[clientId], [field]: updated }
    }))

    const { error } = await (supabase as any)
      .from('client_settings')
      .update({ [field]: updated })
      .eq('id', settings.id)

    if (error) {
      toast.error('Failed to save: ' + error.message)
      setSettingsMap(prev => ({
        ...prev,
        [clientId]: { ...prev[clientId], [field]: current }
      }))
    }
  }

  if (loading) return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )

  const settings = selectedClient ? settingsMap[selectedClient] : null
  const metrics = activeCategory === 'content' ? CONTENT_METRICS : LEADGEN_METRICS
  const activeField = activeCategory === 'content' ? 'active_content_metrics' : 'active_leadgen_metrics'
  const activeIds: string[] = settings?.[activeField] || []

  // Group metrics by group
  const grouped = metrics.reduce<Record<string, typeof metrics>>((acc, m) => {
    if (!acc[m.group]) acc[m.group] = []
    acc[m.group].push(m)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex gap-3 flex-wrap">
        {clients.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedClient(c.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-bold border transition-colors ${
              selectedClient === c.id
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border text-muted-foreground hover:border-primary hover:text-primary'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {selectedClient && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="text-lg">
                {clients.find(c => c.id === selectedClient)?.name} - Metric Fields
              </CardTitle>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveCategory('content')}
                  className={`px-3 py-1 rounded text-sm font-bold border transition-colors ${
                    activeCategory === 'content'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border text-muted-foreground hover:border-primary'
                  }`}
                >
                  Content
                </button>
                <button
                  onClick={() => setActiveCategory('leadgen')}
                  className={`px-3 py-1 rounded text-sm font-bold border transition-colors ${
                    activeCategory === 'leadgen'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border text-muted-foreground hover:border-primary'
                  }`}
                >
                  Lead Gen
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(grouped).map(([group, groupMetrics]) => (
                <div key={group}>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 border-b pb-1">{group}</p>
                  <div className="space-y-1">
                    {groupMetrics.map(m => (
                      <div key={m.id} className="flex items-center justify-between py-2 px-1 rounded hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{m.name}</span>
                          <Badge variant="outline" className="text-[10px] font-mono px-1 py-0">{m.id}</Badge>
                          {m.type === 'auto' && <Badge variant="secondary" className="text-[10px] px-1 py-0">auto</Badge>}
                        </div>
                        <Switch
                          checked={activeIds.includes(m.id)}
                          onCheckedChange={() => handleToggle(selectedClient, m.id, activeCategory)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
