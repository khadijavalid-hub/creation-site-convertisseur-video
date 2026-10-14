'use client'

import { useEffect, useState } from 'react'
import { SELECT_TOOL_EVENT, type ToolTab } from '@/components/tools-menu'
import { FileAudio, MonitorPlay as Youtube } from 'lucide-react'
import { FileConverter } from '@/components/file-converter'
import { YoutubeInfo } from '@/components/youtube-info'
import { cn } from '@/lib/utils'

const TABS = [
  { id: 'convert', label: 'Convertir un fichier', icon: FileAudio },
  { id: 'youtube', label: 'Infos YouTube', icon: Youtube },
] as const

type TabId = (typeof TABS)[number]['id']

export function ToolCard() {
  const [active, setActive] = useState<TabId>('convert')

  useEffect(() => {
    const onSelect = (e: Event) => setActive((e as CustomEvent<ToolTab>).detail)
    window.addEventListener(SELECT_TOOL_EVENT, onSelect)
    return () => window.removeEventListener(SELECT_TOOL_EVENT, onSelect)
  }, [])

  return (
    <div id="outil" className="w-full max-w-2xl scroll-mt-24 rounded-2xl border bg-card p-2 shadow-2xl shadow-primary/5">
      <div role="tablist" aria-label="Outils" className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            id={`tab-${id}`}
            role="tab"
            type="button"
            aria-selected={active === id}
            aria-controls={`panel-${id}`}
            onClick={() => setActive(id)}
            className={cn(
              'flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              active === id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
      {TABS.map(({ id }) => (
        <div
          key={id}
          id={`panel-${id}`}
          role="tabpanel"
          aria-labelledby={`tab-${id}`}
          hidden={active !== id}
          className="p-4 sm:p-6"
        >
          {id === 'convert' ? <FileConverter /> : <YoutubeInfo />}
        </div>
      ))}
    </div>
  )
}
