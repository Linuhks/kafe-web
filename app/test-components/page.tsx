export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-kafe-surface font-sans">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-kafe-surface border-b border-kafe-outline-variant px-margin-page py-3 flex items-center justify-between">
        <span className="text-label-sm tracking-widest text-kafe-primary uppercase">Kafe</span>
        <nav className="hidden md:flex items-center gap-8">
          {["Design System", "Shop", "Roastery", "Our Story"].map((link) => (
            <span key={link} className="text-label-sm text-kafe-on-surface-variant hover:text-kafe-primary cursor-pointer transition-colors">
              {link}
            </span>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button className="text-kafe-on-surface-variant hover:text-kafe-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
          </button>
          <button className="text-kafe-on-surface-variant hover:text-kafe-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">person</span>
          </button>
        </div>
      </header>

      <main className="px-margin-page">
        {/* Page header */}
        <section className="py-stack-lg border-b border-kafe-outline-variant">
          <p className="text-label-sm text-kafe-primary uppercase tracking-widest mb-4">Foundations</p>
          <h1 className="text-display-hero text-kafe-on-surface" style={{ fontFamily: "var(--font-jakarta)" }}>
            System
          </h1>
          <p className="text-body-lg text-kafe-on-surface-variant max-w-2xl mt-6">
            A comprehensive reference for Kafe&apos;s visual language — typography, color, interactive states, and composite patterns used across the product.
          </p>
        </section>

        {/* Typography & Palette */}
        <section className="py-stack-lg border-b border-kafe-outline-variant">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-kafe-primary">text_fields</span>
            <h2 className="text-headline-md text-kafe-on-surface">Typography &amp; Palette</h2>
          </div>
          <div className="grid grid-cols-12 gap-gutter-grid">
            {/* Typography canvas */}
            <div className="col-span-12 lg:col-span-7 bg-kafe-surface-container-low rounded-xl p-8 space-y-6">
              <div>
                <p className="text-label-sm text-kafe-on-surface-variant mb-1">Display Hero · 120/110% · 800</p>
                <p className="text-display-hero text-kafe-on-surface leading-none" style={{ fontSize: "clamp(48px, 8vw, 120px)", fontFamily: "var(--font-jakarta)" }}>Ritual</p>
              </div>
              <div>
                <p className="text-label-sm text-kafe-on-surface-variant mb-1">Headline Large · 32/120% · 700</p>
                <p className="text-headline-lg text-kafe-on-surface" style={{ fontFamily: "var(--font-jakarta)" }}>Single Origin</p>
              </div>
              <div>
                <p className="text-label-sm text-kafe-on-surface-variant mb-1">Headline Medium · 24/130% · 600</p>
                <p className="text-headline-md text-kafe-on-surface">Guatemalan Antigua</p>
              </div>
              <div>
                <p className="text-label-sm text-kafe-on-surface-variant mb-1">Body Large · 18/160% · 400</p>
                <p className="text-body-lg text-kafe-on-surface">Notes of dark chocolate, dried fruit, and a bright citrus finish.</p>
              </div>
              <div>
                <p className="text-label-sm text-kafe-on-surface-variant mb-1">Body Medium · 16/150% · 400</p>
                <p className="text-body-md text-kafe-on-surface">250g · Medium Roast · Filter &amp; Espresso</p>
              </div>
              <div>
                <p className="text-label-sm text-kafe-on-surface-variant mb-1">Label Small · 14/100% · 600</p>
                <p className="text-label-sm text-kafe-primary uppercase tracking-widest">Add to Selection</p>
              </div>
            </div>
            {/* Color swatches */}
            <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-4">
              {[
                { label: "Primary", bg: "bg-kafe-primary", text: "text-kafe-on-primary", hex: "#553722" },
                { label: "Accent", bg: "bg-kafe-secondary-container", text: "text-kafe-on-surface", hex: "#FDDAAC" },
                { label: "Surface", bg: "bg-kafe-surface-container", text: "text-kafe-on-surface", hex: "#F0EDED" },
                { label: "Neutral", bg: "bg-kafe-outline", text: "text-kafe-on-primary", hex: "#82746D" },
              ].map(({ label, bg, text, hex }) => (
                <div key={label} className={`${bg} rounded-xl p-6 flex flex-col justify-between aspect-square`}>
                  <span className={`text-label-sm ${text} uppercase tracking-widest`}>{label}</span>
                  <span className={`text-label-sm ${text} font-mono`}>{hex}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Elements */}
        <section className="py-stack-lg border-b border-kafe-outline-variant">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-kafe-primary">touch_app</span>
            <h2 className="text-headline-md text-kafe-on-surface">Interactive Elements</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-kafe-outline-variant">
                  {["Variant", "Normal", "Hover", "Disabled"].map((h) => (
                    <th key={h} className="pb-4 pr-8 text-label-sm text-kafe-on-surface-variant uppercase tracking-widest font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-kafe-outline-variant">
                {/* PRIMARY */}
                <tr>
                  <td className="py-6 pr-8 text-label-sm text-kafe-on-surface-variant uppercase tracking-widest">PRIMARY</td>
                  <td className="py-6 pr-8">
                    <button className="px-6 py-2.5 bg-kafe-primary text-kafe-on-primary rounded-full text-label-sm">
                      Order Now
                    </button>
                  </td>
                  <td className="py-6 pr-8">
                    <button className="px-6 py-2.5 bg-kafe-primary-container text-kafe-on-primary-container rounded-full text-label-sm">
                      Order Now
                    </button>
                  </td>
                  <td className="py-6 pr-8">
                    <button className="px-6 py-2.5 bg-kafe-surface-container text-kafe-on-surface-variant rounded-full text-label-sm cursor-not-allowed opacity-50" disabled>
                      Order Now
                    </button>
                  </td>
                </tr>
                {/* OUTLINE */}
                <tr>
                  <td className="py-6 pr-8 text-label-sm text-kafe-on-surface-variant uppercase tracking-widest">OUTLINE</td>
                  <td className="py-6 pr-8">
                    <button className="px-6 py-2.5 border border-kafe-primary text-kafe-primary rounded-full text-label-sm bg-transparent">
                      Learn More
                    </button>
                  </td>
                  <td className="py-6 pr-8">
                    <button className="px-6 py-2.5 border border-kafe-primary-container bg-kafe-primary-container/20 text-kafe-primary rounded-full text-label-sm">
                      Learn More
                    </button>
                  </td>
                  <td className="py-6 pr-8">
                    <button className="px-6 py-2.5 border border-kafe-outline text-kafe-on-surface-variant rounded-full text-label-sm cursor-not-allowed opacity-50" disabled>
                      Learn More
                    </button>
                  </td>
                </tr>
                {/* DESTRUCTIVE */}
                <tr>
                  <td className="py-6 pr-8 text-label-sm text-kafe-on-surface-variant uppercase tracking-widest">DESTRUCTIVE</td>
                  <td className="py-6 pr-8">
                    <button className="px-6 py-2.5 bg-kafe-error text-kafe-on-error rounded-full text-label-sm">
                      Cancel Order
                    </button>
                  </td>
                  <td className="py-6 pr-8">
                    <button className="px-6 py-2.5 bg-kafe-error-container text-kafe-on-error-container rounded-full text-label-sm">
                      Cancel Order
                    </button>
                  </td>
                  <td className="py-6 pr-8">
                    <button className="px-6 py-2.5 bg-kafe-surface-container text-kafe-on-surface-variant rounded-full text-label-sm cursor-not-allowed opacity-50" disabled>
                      Cancel Order
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Order States */}
        <section className="py-stack-lg border-b border-kafe-outline-variant">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-kafe-primary">receipt_long</span>
            <h2 className="text-headline-md text-kafe-on-surface">Order States</h2>
          </div>
          <div className="bg-kafe-surface-container-low rounded-xl p-8">
            <div className="flex flex-wrap gap-3">
              {/* Recebido */}
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-label-sm">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Recebido
              </span>
              {/* Em preparo */}
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-label-sm">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Em preparo
              </span>
              {/* Concluído */}
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-label-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Concluído
              </span>
              {/* Cancelado */}
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kafe-error-container text-kafe-on-error-container text-label-sm">
                <span className="w-2 h-2 rounded-full bg-kafe-error" />
                Cancelado
              </span>
            </div>
          </div>
        </section>

        {/* Form Inputs */}
        <section className="py-stack-lg border-b border-kafe-outline-variant">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-kafe-primary">edit</span>
            <h2 className="text-headline-md text-kafe-on-surface">Form Inputs</h2>
          </div>
          <div className="bg-kafe-surface-container-low rounded-xl p-8 max-w-xl space-y-8">
            {/* Underline input */}
            <div>
              <label className="text-label-sm text-kafe-on-surface-variant block mb-2">Email Address</label>
              <input
                type="email"
                placeholder="ritual@kafe.com"
                className="w-full bg-transparent border-b border-kafe-outline-variant focus:border-kafe-primary outline-none py-2 text-body-md text-kafe-on-surface placeholder:text-kafe-on-surface-variant/50 transition-colors"
              />
            </div>
            {/* Box textarea */}
            <div>
              <label className="text-label-sm text-kafe-on-surface-variant block mb-2">Order Observations</label>
              <textarea
                rows={3}
                placeholder="Any special instructions..."
                className="w-full bg-transparent border border-kafe-outline-variant rounded-lg focus:border-kafe-primary outline-none p-3 text-body-md text-kafe-on-surface placeholder:text-kafe-on-surface-variant/50 transition-colors resize-none"
              />
            </div>
          </div>
        </section>

        {/* Navigation Shells */}
        <section className="py-stack-lg border-b border-kafe-outline-variant">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-kafe-primary">navigation</span>
            <h2 className="text-headline-md text-kafe-on-surface">Navigation Shells</h2>
          </div>
          <div className="grid grid-cols-12 gap-gutter-grid">
            {/* Top bar mockup */}
            <div className="col-span-12 lg:col-span-8 bg-kafe-surface-container-low rounded-xl overflow-hidden">
              <div className="bg-kafe-surface border-b border-kafe-outline-variant px-6 py-4 flex items-center justify-between">
                <span className="text-label-sm text-kafe-primary uppercase tracking-widest font-bold">KAFE</span>
                <div className="flex items-center gap-6">
                  {["Shop", "Roastery", "Our Story"].map((item) => (
                    <span key={item} className="text-label-sm text-kafe-on-surface-variant">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-kafe-on-surface-variant text-[18px]">search</span>
                  <span className="material-symbols-outlined text-kafe-on-surface-variant text-[18px]">shopping_cart</span>
                  <span className="material-symbols-outlined text-kafe-on-surface-variant text-[18px]">person</span>
                </div>
              </div>
              <div className="p-8 bg-kafe-background/50 h-32 flex items-center justify-center">
                <span className="text-label-sm text-kafe-on-surface-variant">Page content area</span>
              </div>
            </div>
            {/* Sidebar mockup */}
            <div className="col-span-12 lg:col-span-4 bg-kafe-surface-container-low rounded-xl overflow-hidden">
              <div className="bg-kafe-surface border-b border-kafe-outline-variant px-5 py-4">
                <p className="text-label-sm text-kafe-primary uppercase tracking-widest">Your Selection</p>
              </div>
              <nav className="p-4 space-y-1">
                {[
                  { icon: "coffee", label: "Coffee Beans" },
                  { icon: "coffee_maker", label: "Brewing Gear" },
                  { icon: "loyalty", label: "Subscription" },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-kafe-surface-container cursor-pointer">
                    <span className="material-symbols-outlined text-kafe-on-surface-variant text-[18px]">{icon}</span>
                    <span className="text-body-md text-kafe-on-surface">{label}</span>
                  </div>
                ))}
              </nav>
              <div className="p-4 border-t border-kafe-outline-variant">
                <button className="w-full py-2.5 bg-kafe-primary text-kafe-on-primary rounded-full text-label-sm">
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Composite Cards */}
        <section className="py-stack-lg border-b border-kafe-outline-variant">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-kafe-primary">grid_view</span>
            <h2 className="text-headline-md text-kafe-on-surface">Composite Cards</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-grid">
            {/* Order card */}
            <div className="bg-kafe-surface-container-low rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-label-sm text-kafe-on-surface-variant uppercase tracking-widest">Order #8842</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-label-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Em preparo
                </span>
              </div>
              <div>
                <p className="text-headline-md text-kafe-on-surface">Marcos V.</p>
                <p className="text-body-md text-kafe-on-surface-variant mt-1">Guatemalan Antigua × 2</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-kafe-outline-variant">
                <span className="text-body-md text-kafe-on-surface-variant">Total</span>
                <span className="text-headline-md text-kafe-primary">R$ 89,90</span>
              </div>
            </div>

            {/* Product card */}
            <div className="bg-kafe-surface-container-low rounded-xl overflow-hidden">
              <div className="h-48 bg-kafe-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-kafe-on-surface-variant" style={{ fontSize: 64 }}>coffee</span>
              </div>
              <div className="p-6 space-y-3">
                <p className="text-label-sm text-kafe-primary uppercase tracking-widest">Single Origin</p>
                <p className="text-headline-md text-kafe-on-surface">Guatemalan Antigua</p>
                <p className="text-body-md text-kafe-on-surface-variant">Dark chocolate, dried fruit, bright citrus.</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-headline-md text-kafe-on-surface">R$ 44,90</span>
                  <button className="px-5 py-2 bg-kafe-primary text-kafe-on-primary rounded-full text-label-sm">
                    Add to Selection
                  </button>
                </div>
              </div>
            </div>

            {/* Subscription card */}
            <div className="bg-kafe-primary rounded-xl p-6 space-y-4 flex flex-col">
              <span className="inline-block self-start px-3 py-1 rounded-full border border-kafe-on-primary/30 text-kafe-on-primary text-label-sm uppercase tracking-widest">
                MEMBERSHIP
              </span>
              <div className="flex-1">
                <p className="text-headline-lg text-kafe-on-primary" style={{ fontFamily: "var(--font-jakarta)" }}>The Ritualist</p>
                <p className="text-body-md text-kafe-on-primary/70 mt-2">
                  Monthly curated bag, roaster notes, and 15% off all orders.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-headline-lg text-kafe-on-primary" style={{ fontFamily: "var(--font-jakarta)" }}>R$ 79</span>
                  <span className="text-body-md text-kafe-on-primary/70">/mês</span>
                </div>
                <button className="w-full py-3 bg-kafe-on-primary text-kafe-primary rounded-full text-label-sm">
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-margin-page py-8 border-t border-kafe-outline-variant flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-label-sm text-kafe-primary uppercase tracking-widest">Kafe</p>
          <p className="text-body-md text-kafe-on-surface-variant mt-1">© 2024 Kafe Roastery. All rights reserved.</p>
        </div>
        <nav className="flex items-center gap-6">
          {["Privacy Policy", "Terms of Service", "Contact", "Wholesale"].map((link) => (
            <span key={link} className="text-label-sm text-kafe-on-surface-variant hover:text-kafe-primary cursor-pointer transition-colors">
              {link}
            </span>
          ))}
        </nav>
      </footer>
    </div>
  )
}
