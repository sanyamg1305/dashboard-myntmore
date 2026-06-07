import React, { useState } from 'react'
import { Users, Globe, Star } from 'lucide-react'
import { DataEntryPage } from './DataEntryPage'
import { MMContentPage } from '../mm/MMContentPage'
import { TJPersonalBrandPage } from '../tj-brand/TJBrandPage'

type Section = 'client' | 'mm' | 'tj'

const sections: { id: Section; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'client', label: 'Client Data Entry', icon: Users, description: 'Weekly metrics for client accounts' },
  { id: 'mm', label: 'MM Content', icon: Globe, description: 'Myntmore company content metrics' },
  { id: 'tj', label: 'TJ Personal Brand', icon: Star, description: 'TJ personal branding metrics' },
]

export function DataEntryHub() {
  const [active, setActive] = useState<Section>('client')

  return (
    <div className="min-h-screen bg-background">
      {/* Section Switcher */}
      <div className="border-b bg-card sticky top-0 z-10">
        <div className="px-6 pt-5 pb-0">
          <h1 className="text-xl font-bold tracking-tight mb-4">Data Entry</h1>
          <div className="flex gap-1">
            {sections.map((s) => {
              const isActive = active === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-md border-b-2 transition-all ${
                    isActive
                      ? 'border-gold text-foreground bg-gold/5'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <s.icon className={`h-4 w-4 ${isActive ? 'text-gold' : ''}`} />
                  {s.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Section Content */}
      <div>
        {active === 'client' && <DataEntryPage />}
        {active === 'mm' && <MMContentPage embedded />}
        {active === 'tj' && <TJPersonalBrandPage embedded />}
      </div>
    </div>
  )
}
