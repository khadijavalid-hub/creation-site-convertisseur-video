import { Gauge, Image as ImageIcon, Infinity as InfinityIcon, Lock, MonitorSmartphone, Sparkles } from 'lucide-react'

const STEPS = [
  { title: 'Importez ou collez', text: 'Déposez votre fichier vidéo, ou collez un lien YouTube pour en afficher les informations.' },
  { title: 'Choisissez le format', text: 'MP3, M4A, WAV ou MP4 : des formats compatibles avec tous vos appareils.' },
  { title: 'Téléchargez', text: 'Votre fichier converti ou votre miniature HD est prêt en quelques secondes.' },
]

const FEATURES = [
  { icon: Gauge, title: 'Rapide', text: 'Conversion en deux clics, sans file d’attente ni inscription.' },
  { icon: Sparkles, title: 'Gratuit', text: 'Aucun abonnement, aucune publicité intrusive, aucune limite cachée.' },
  { icon: Lock, title: 'Privé', text: 'Vos fichiers sont traités dans votre navigateur et ne sont jamais envoyés.' },
  { icon: InfinityIcon, title: 'Sans limites', text: 'Convertissez autant de fichiers que vous le souhaitez, jusqu’à 500 Mo.' },
  { icon: ImageIcon, title: 'Miniatures HD', text: 'Récupérez la miniature d’une vidéo YouTube dans toutes les résolutions.' },
  { icon: MonitorSmartphone, title: 'Multi-appareils', text: 'Fonctionne sur ordinateur, tablette et smartphone, sans application.' },
]

export function HowItWorks() {
  return (
    <section id="fonctionnement" className="mx-auto w-full max-w-5xl px-4 py-20">
      <h2 className="text-balance text-center text-3xl font-bold tracking-tight sm:text-4xl">Comment ça fonctionne ?</h2>
      <ol className="mt-12 grid gap-6 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex flex-col gap-3 rounded-2xl border bg-card p-6">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
              {i + 1}
            </span>
            <h3 className="text-lg font-semibold">{step.title}</h3>
            <p className="leading-relaxed text-muted-foreground">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function Features() {
  return (
    <section id="avantages" className="border-y bg-muted/30">
      <div className="mx-auto w-full max-w-5xl px-4 py-20">
        <h2 className="text-balance text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Simple, rapide et respectueux de votre vie privée
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-center leading-relaxed text-muted-foreground">
          Un convertisseur audio et vidéo complet qui tourne entièrement sur votre appareil.
        </p>
        <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const FAQ = [
  {
    q: 'Puis-je télécharger directement une vidéo YouTube ?',
    a: 'Non. Les conditions d’utilisation de YouTube interdisent le téléchargement en dehors de leurs services. Notre outil YouTube affiche les informations publiques et la miniature de la vidéo. Pour la hors-ligne, utilisez YouTube Premium.',
  },
  {
    q: 'Mes fichiers sont-ils envoyés sur un serveur ?',
    a: 'Non. La conversion utilise ffmpeg compilé en WebAssembly et s’exécute entièrement dans votre navigateur.',
  },
  {
    q: 'Pourquoi le premier chargement prend-il quelques secondes ?',
    a: 'Le moteur de conversion (environ 30 Mo) est téléchargé une seule fois, puis mis en cache par votre navigateur.',
  },
]

export function Faq() {
  return (
    <section id="faq" className="mx-auto w-full max-w-3xl px-4 py-20">
      <h2 className="text-balance text-center text-3xl font-bold tracking-tight sm:text-4xl">Questions fréquentes</h2>
      <div className="mt-10 flex flex-col gap-3">
        {FAQ.map((item) => (
          <details key={item.q} className="group rounded-xl border bg-card px-5 py-4 open:pb-5">
            <summary className="cursor-pointer list-none font-medium marker:hidden">
              <span className="flex items-center justify-between gap-4">
                {item.q}
                <span className="text-xl text-primary transition-transform group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 leading-relaxed text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
