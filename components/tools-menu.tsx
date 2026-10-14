'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ChevronDown,
  FileAudio,
  Film,
  HelpCircle,
  ImageIcon,
  ListChecks,
  MonitorPlay,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const SELECT_TOOL_EVENT = 'select-tool'
export type ToolTab = 'convert' | 'youtube'

type MenuItem = {
  title: string
  description: string
  href: string
  icon: LucideIcon
  tone: string
  tab?: ToolTab
}

const ITEMS: MenuItem[] = [
  {
    title: 'Infos vidéo YouTube',
    description: 'Titre, chaîne et aperçu en un clic',
    href: '#outil',
    icon: MonitorPlay,
    tone: 'bg-red-500/15 text-red-400',
    tab: 'youtube',
  },
  {
    title: 'Miniatures YouTube',
    description: 'Téléchargez la miniature en HD',
    href: '#outil',
    icon: ImageIcon,
    tone: 'bg-sky-500/15 text-sky-400',
    tab: 'youtube',
  },
  {
    title: 'Convertir en MP3',
    description: 'Extraire l’audio de vos vidéos',
    href: '#outil',
    icon: FileAudio,
    tone: 'bg-pink-500/15 text-pink-400',
    tab: 'convert',
  },
  {
    title: 'Convertir en MP4',
    description: 'M4A, WAV, MP4 depuis vos fichiers',
    href: '#outil',
    icon: Film,
    tone: 'bg-emerald-500/15 text-emerald-400',
    tab: 'convert',
  },
  {
    title: 'Comment ça marche',
    description: 'Le guide en trois étapes',
    href: '#fonctionnement',
    icon: ListChecks,
    tone: 'bg-violet-500/15 text-violet-400',
  },
  {
    title: 'Questions fréquentes',
    description: 'Formats, limites et confidentialité',
    href: '#faq',
    icon: HelpCircle,
    tone: 'bg-amber-500/15 text-amber-400',
  },
]

export function ToolsMenu() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const handleSelect = (item: MenuItem) => {
    if (item.tab) {
      window.dispatchEvent(new CustomEvent<ToolTab>(SELECT_TOOL_EVENT, { detail: item.tab }))
    }
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="sm:relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="tools-menu-panel"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-1 rounded-md px-2 py-1 font-medium uppercase tracking-wide transition-colors hover:text-primary',
          open && 'text-primary',
        )}
      >
        Nos outils
        <ChevronDown
          className={cn('size-4 transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      <div
        id="tools-menu-panel"
        hidden={!open}
        className="fixed inset-x-3 top-16 z-30 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-3 sm:w-[38rem]"
      >
        <ul className="grid gap-1 rounded-xl border bg-popover p-3 text-popover-foreground shadow-2xl sm:grid-cols-2">
          {ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.title}>
                <a
                  href={item.href}
                  onClick={() => handleSelect(item)}
                  className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                >
                  <span className={cn('flex size-12 shrink-0 items-center justify-center rounded-xl', item.tone)}>
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="font-semibold text-foreground">{item.title}</span>
                    <span className="text-sm text-muted-foreground">{item.description}</span>
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
