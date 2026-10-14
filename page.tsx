import { Faq, Features, HowItWorks } from '@/components/landing-sections'
import { SiteFooter, SiteHeader } from '@/components/site-chrome'
import { ToolCard } from '@/components/tool-card'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_at_top,var(--color-primary)_0%,transparent_60%)] opacity-20"
          />
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 pb-20 pt-14 sm:pt-20">
            <div className="flex max-w-3xl flex-col items-center gap-5 text-center">
              <span className="rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                Gratuit · Sans inscription · 100 % local
              </span>
              <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                Le convertisseur <span className="text-primary">MP3 et MP4</span> rapide et gratuit
              </h1>
              <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                Importez une vidéo et laissez la magie opérer. Ou collez un lien YouTube pour récupérer ses infos et sa
                miniature HD.
              </p>
            </div>
            <ToolCard />
          </div>
        </section>
        <HowItWorks />
        <Features />
        <Faq />
      </main>
      <SiteFooter />
    </>
  )
}
