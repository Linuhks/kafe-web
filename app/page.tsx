import { Coffee } from 'lucide-react'
import { ExplorarCardapioButton } from '@/components/landing/ExplorarCardapioButton'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-kafe-surface">
      <header className="flex items-center justify-between px-8 py-6 md:px-12">
        <div className="flex items-center gap-2 text-kafe-primary font-semibold text-lg">
          <Coffee className="h-5 w-5" />
          <span>Kafe</span>
        </div>
        <a
          href="#menu"
          className="hidden md:block text-sm font-medium text-kafe-on-surface-variant hover:text-kafe-primary transition-colors"
        >
          Cardápio
        </a>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="animate-fade-in-up mb-8" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-kafe-primary text-kafe-on-primary shadow-lg">
              <Coffee className="h-10 w-10" />
            </div>
          </div>

          <div className="animate-fade-in-up space-y-3 mb-8" style={{ animationDelay: '0.3s' }}>
            <h1 className="text-8xl md:text-9xl font-bold text-kafe-primary leading-none tracking-tight">
              Kafe
            </h1>
            <p className="text-2xl text-kafe-secondary font-medium">
              Café &amp; Experiências
            </p>
          </div>

          <div className="animate-fade-in-up mb-10" style={{ animationDelay: '0.5s' }}>
            <p className="text-kafe-on-surface-variant text-body-lg leading-relaxed max-w-lg mx-auto">
              Cappuccinos cremosos, expressos intensos, lattes aveludados e muito mais.
              Cada copo, uma experiência única feita com grãos cuidadosamente selecionados.
            </p>
          </div>

          <div className="animate-fade-in-up flex flex-wrap items-center justify-center gap-3 mb-12" style={{ animationDelay: '0.7s' }}>
            {['Cappuccino', 'Espresso', 'Latte', 'Mocha', 'Cold Brew'].map((item) => (
              <span
                key={item}
                className="px-4 py-1.5 rounded-full bg-kafe-surface-container-lowest border border-kafe-outline-variant text-kafe-primary text-sm font-medium shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
            <ExplorarCardapioButton />
          </div>
        </div>
      </main>

      <section id="menu" className="py-24 bg-kafe-surface-container-lowest">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-headline-lg text-kafe-primary mb-12">Nosso Cardápio</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { label: 'Clássicos', desc: 'A pureza do café em sua melhor forma.' },
              { label: 'Especiais', desc: 'Combinações únicas com ingredientes selecionados.' },
              { label: 'Acompanhamentos', desc: 'Doces e salgados feitos diariamente.' },
            ].map(({ label, desc }) => (
              <div
                key={label}
                className="p-8 bg-kafe-surface-container-low border border-kafe-outline-variant rounded-2xl hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-kafe-primary rounded-lg mb-4 mx-auto" />
                <h4 className="text-headline-md text-kafe-on-surface mb-2">{label}</h4>
                <p className="text-body-md text-kafe-on-surface-variant">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="text-center py-6 text-body-md text-kafe-on-surface-variant border-t border-kafe-outline-variant">
        Feito com amor e muito café ☕
      </footer>
    </div>
  )
}
