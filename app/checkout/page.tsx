'use client'

import TopNavBar from '@/components/layout/TopNavBar'
import Footer from '@/components/layout/Footer'

const INPUT_CLASS =
  'w-full bg-transparent border-b border-kafe-outline-variant focus:border-kafe-primary outline-none py-3 text-body-lg text-kafe-on-surface placeholder:text-kafe-on-surface-variant/50 transition-colors'

const LABEL_CLASS = 'text-label-sm text-kafe-on-surface-variant uppercase'

const DEMO_ITEMS = [
  {
    id: 1,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD61Zs_BPzg-C_krrH-6djM6OFhU0Y4o_ZcZiVcAijv9IlWfj8DKsta2wiGYEI7Y4cuylzMyklV0xq3CbN_f30xbc6xy8Ph8UeMSjlZI42qEomA9hXIsX0fO_lCXLQJ00UIWtJf5OuO9pL9GGfGKZ1G59CobLbHqAAncB6ElsAwaDL2zorwBtD7Erv6Ju-lrS425esfLT3YiW8ELF4cxkejp1SZkXRaKfBztqK3pHtumYocWD1qwL7yIwrpm9g3fCUZ4Nsm_eqOXAQ',
    name: 'Midnight Blend',
    detail: 'Whole Bean • 250g',
    price: 'R$ 44,90',
  },
  {
    id: 2,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC25QA-jIoFcUHR8e0Wgm5q3BvZNFIzSiuqCmSlTfJECi6O2kGk05rHlLwMduX4WJvrduU0PjRr2D-1oRfufyXKIU67lAfSVg9zDh8yVUh6DmmjrL7qQSZsQ76shWsrnstU-fOFe8Hg4mtszhaFsfI6jrW_Xq2kh8Wke4DAdrJtE9MW8f5VAGqhWoZXq7cXwMgpT79KDpeZdebPB_5rIcraoJGPy6v6Ka8IEIro6OUFdwjdZz9xSA3vx43bsJmcjptrYPG_W_6pDUo',
    name: 'V60 Ceramic Dripper',
    detail: 'Matte Black • Ceramic',
    price: 'R$ 89,90',
  },
]

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-stack-sm">
      <span className="text-label-sm text-kafe-primary font-bold">{number}</span>
      <h2 className="text-headline-md text-kafe-on-surface">{title}</h2>
    </div>
  )
}

function FormField({
  label,
  type = 'text',
  placeholder,
  className = '',
}: {
  label: string
  type?: string
  placeholder: string
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className={LABEL_CLASS}>{label}</label>
      <input type={type} placeholder={placeholder} className={INPUT_CLASS} />
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-kafe-surface">
      <TopNavBar />

      <main className="max-w-7xl mx-auto px-margin-page py-stack-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* ── Left column: form ── */}
          <div className="lg:col-span-7 space-y-stack-lg">

            <header>
              <h1
                className="text-headline-lg text-kafe-primary mb-2"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                Checkout
              </h1>
              <p className="text-body-md text-kafe-on-surface-variant">
                Complete your ritual selection.
              </p>
            </header>

            {/* 01 Contact */}
            <section className="space-y-stack-md">
              <SectionHeader number="01" title="Contact Information" />
              <FormField label="Email Address" type="email" placeholder="ritual@kafe.com" />
            </section>

            {/* 02 Shipping */}
            <section className="space-y-stack-md">
              <SectionHeader number="02" title="Shipping Address" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="First Name" placeholder="Julian" />
                <FormField label="Last Name" placeholder="Anders" />
                <FormField label="Street Address" placeholder="123 Roastery Lane" className="md:col-span-2" />
                <FormField label="City" placeholder="Portland" />
                <FormField label="Postal Code" placeholder="97201" />
              </div>
            </section>

            {/* 03 Payment */}
            <section className="space-y-stack-md">
              <SectionHeader number="03" title="Payment Method" />
              <div className="bg-kafe-surface-container-low p-6 rounded-xl border border-kafe-outline-variant/30 space-y-6">
                <div className="flex flex-col gap-2">
                  <label className={LABEL_CLASS}>Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      className={INPUT_CLASS}
                    />
                    <span className="material-symbols-outlined absolute right-0 top-3 text-kafe-on-surface-variant text-[20px]">
                      credit_card
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <FormField label="Expiry Date" placeholder="MM/YY" />
                  <FormField label="CVC" placeholder="123" />
                </div>
              </div>
            </section>

            {/* CTA */}
            <div className="pt-stack-md">
              <button className="group w-full bg-kafe-primary text-kafe-on-primary py-6 rounded-xl text-headline-md flex items-center justify-center gap-4 hover:bg-kafe-primary/90 transition-colors">
                Confirm Purchase
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </button>
              <p className="text-center text-label-sm text-kafe-on-surface-variant mt-4">
                By confirming, you agree to our Terms of Service.
              </p>
            </div>
          </div>

          {/* ── Right column: order summary ── */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 bg-kafe-surface-container-lowest border border-kafe-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="p-8 space-y-8">
                <h2 className="text-headline-md text-kafe-primary">Order Summary</h2>

                {/* Item list */}
                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                  {DEMO_ITEMS.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg flex-shrink-0 border border-kafe-outline-variant/20 overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.src = '/images/product-placeholder.svg' }}
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between gap-2">
                          <h3 className="text-body-md font-semibold text-kafe-on-surface">{item.name}</h3>
                          <span className="text-body-md font-semibold text-kafe-primary whitespace-nowrap">
                            {item.price}
                          </span>
                        </div>
                        <p className="text-label-sm text-kafe-on-surface-variant mt-1">{item.detail}</p>
                        <p className="text-label-sm text-kafe-on-surface-variant mt-2">Qty: 1</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div className="border-t border-kafe-outline-variant pt-6 space-y-3">
                  {[
                    { label: 'Subtotal', value: 'R$ 134,80' },
                    { label: 'Frete', value: 'Grátis', valueClass: 'text-kafe-secondary font-semibold' },
                    { label: 'Impostos estimados', value: 'R$ 10,78' },
                  ].map(({ label, value, valueClass }) => (
                    <div key={label} className="flex justify-between text-body-md text-kafe-on-surface-variant">
                      <span>{label}</span>
                      <span className={valueClass}>{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-4 border-t border-kafe-outline-variant">
                    <span className="text-headline-md text-kafe-on-surface">Total</span>
                    <span className="text-headline-md text-kafe-primary">R$ 145,58</span>
                  </div>
                </div>

                {/* Promo code */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Código promocional"
                    className="flex-grow bg-transparent border border-kafe-outline-variant rounded-lg px-4 py-2 text-label-sm text-kafe-on-surface placeholder:text-kafe-on-surface-variant/50 focus:border-kafe-primary outline-none transition-colors"
                  />
                  <button className="px-6 py-2 border border-kafe-primary text-kafe-primary text-label-sm rounded-lg hover:bg-kafe-primary hover:text-kafe-on-primary transition-colors">
                    Aplicar
                  </button>
                </div>
              </div>

              {/* Trust badges */}
              <div className="bg-kafe-surface-container py-4 px-8 flex justify-center gap-6 border-t border-kafe-outline-variant/30">
                {[
                  { icon: 'lock', label: 'Seguro' },
                  { icon: 'local_shipping', label: 'Frete Grátis' },
                  { icon: 'verified', label: 'Garantia' },
                ].map(({ icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 text-[10px] text-kafe-on-surface-variant uppercase tracking-widest"
                  >
                    <span className="material-symbols-outlined text-[16px]">{icon}</span>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
