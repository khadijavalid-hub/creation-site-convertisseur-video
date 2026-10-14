import { AudioLines } from 'lucide-react'
import { ToolsMenu } from '@/components/tools-menu'

function Logo() {
  return (
    <a href="/" className="flex items-center gap-2 font-bold tracking-tight">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <AudioLines className="size-4" aria-hidden="true" />
      </span>
      <span className="text-lg">
        conv<span className="text-primary">ertz</span>
      </span>
    </a>
  )
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Logo />
        <nav aria-label="Navigation principale">
          <ul className="flex items-center gap-1 text-sm text-muted-foreground sm:gap-4">
            <li>
              <ToolsMenu />
            </li>
            <li className="hidden sm:block">
              <a href="#fonctionnement" className="rounded-md px-2 py-1 hover:text-foreground">
                Fonctionnement
              </a>
            </li>
            <li className="hidden sm:block">
              <a href="#avantages" className="rounded-md px-2 py-1 hover:text-foreground">
                Avantages
              </a>
            </li>
            <li>
              <a href="#faq" className="rounded-md px-2 py-1 hover:text-foreground">
                FAQ
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row">
        <Logo />
        <p className="text-center">
          Convertissez uniquement des contenus dont vous détenez les droits. Non affilié à YouTube ou Google.
        </p>
      </div>
    </footer>
  )
}
