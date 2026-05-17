import Link from 'next/link'
import { Coffee, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDF6EE]">
      {/* Minimal top bar */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 text-[#6F4E37] font-semibold text-lg">
          <Coffee className="h-5 w-5" />
          <span>Kafe</span>
        </div>
        <Button variant="ghost" size="sm" asChild className="text-[#6F4E37] hover:text-[#5a3e2b]">
          <Link href="/cardapio">Cardápio</Link>
        </Button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#6F4E37] text-white shadow-lg">
            <Coffee className="h-10 w-10" />
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h1 className="text-8xl md:text-9xl font-bold text-[#6F4E37] leading-none tracking-tight">
              Kafe
            </h1>
            <p className="text-2xl text-[#C4A265] font-medium">
              Café &amp; Experiências
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-lg leading-relaxed max-w-lg mx-auto">
            Cappuccinos cremosos, expressos intensos, lattes aveludados e muito mais.
            Cada copo, uma experiência única feita com grãos cuidadosamente selecionados.
          </p>

          {/* Drink chips */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {['Cappuccino', 'Espresso', 'Latte', 'Mocha', 'Cold Brew'].map((item) => (
              <span
                key={item}
                className="px-4 py-1.5 rounded-full bg-white border border-[#C4A265]/40 text-[#6F4E37] text-sm font-medium shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>

          {/* CTA */}
          <Button
            size="lg"
            className="bg-[#6F4E37] hover:bg-[#5a3e2b] text-white px-10 py-6 text-lg rounded-full shadow-md hover:shadow-lg transition-all group"
            asChild
          >
            <Link href="/cardapio">
              Explorar Cardápio
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-400 border-t border-[#C4A265]/20">
        Feito com amor e muito café ☕
      </footer>
    </div>
  )
}
