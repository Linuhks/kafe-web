'use client'

import { BadgeCheck, ChevronRight, CreditCard, Lock, Truck } from 'lucide-react'
import { useTranslations } from 'next-intl'
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

const DEMO_TOTAL = 'R$ 145,58'

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
  const t = useTranslations('checkout')

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
                {t('title')}
              </h1>
              <p className="text-body-md text-kafe-on-surface-variant">
                {t('subtitle')}
              </p>
            </header>

            {/* 01 Contact */}
            <section className="space-y-stack-md">
              <SectionHeader number="01" title={t('sections.contact')} />
              <FormField label={t('fields.email')} type="email" placeholder="ritual@kafe.com" />
            </section>

            {/* 02 Shipping */}
            <section className="space-y-stack-md">
              <SectionHeader number="02" title={t('sections.shipping')} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label={t('fields.firstName')} placeholder="Julian" />
                <FormField label={t('fields.lastName')} placeholder="Anders" />
                <FormField label={t('fields.streetAddress')} placeholder="123 Roastery Lane" className="md:col-span-2" />
                <FormField label={t('fields.city')} placeholder="Portland" />
                <FormField label={t('fields.postalCode')} placeholder="97201" />
              </div>
            </section>

            {/* 03 Payment */}
            <section className="space-y-stack-md">
              <SectionHeader number="03" title={t('sections.payment')} />
              <div className="bg-kafe-surface-container-low p-6 rounded-xl border border-kafe-outline-variant/30 space-y-6">
                <div className="flex flex-col gap-2">
                  <label className={LABEL_CLASS}>{t('fields.cardNumber')}</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      className={INPUT_CLASS}
                    />
                    <CreditCard className="absolute right-0 top-3 text-kafe-on-surface-variant" size={20} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <FormField label={t('fields.expiryDate')} placeholder="MM/YY" />
                  <FormField label={t('fields.cvc')} placeholder="123" />
                </div>
              </div>
            </section>

            {/* CTA */}
            <div className="pt-stack-md">
              <button className="group w-full bg-kafe-primary text-kafe-on-primary py-6 rounded-xl text-headline-md flex items-center justify-center gap-4 hover:bg-kafe-primary/90 transition-colors">
                {t('confirmPurchase')}
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-center text-label-sm text-kafe-on-surface-variant mt-4">
                {t('termsNotice')}
              </p>
            </div>
          </div>

          {/* ── Right column: order summary ── */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 bg-kafe-surface-container-lowest border border-kafe-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="p-8 space-y-8">
                <h2 className="text-headline-md text-kafe-primary">{t('orderSummary')}</h2>

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
                        <p className="text-label-sm text-kafe-on-surface-variant mt-2">{t('qty', { count: 1 })}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div className="border-t border-kafe-outline-variant pt-6 space-y-3">
                  {[
                    { label: t('priceBreakdown.subtotal'), value: 'R$ 134,80' },
                    { label: t('priceBreakdown.shipping'), value: t('priceBreakdown.free'), valueClass: 'text-kafe-secondary font-semibold' },
                    { label: t('priceBreakdown.estimatedTaxes'), value: 'R$ 10,78' },
                  ].map(({ label, value, valueClass }) => (
                    <div key={label} className="flex justify-between text-body-md text-kafe-on-surface-variant">
                      <span>{label}</span>
                      <span className={valueClass}>{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-4 border-t border-kafe-outline-variant">
                    <span className="text-headline-md text-kafe-on-surface">{t('priceBreakdown.total')}</span>
                    <span className="text-headline-md text-kafe-primary">{DEMO_TOTAL}</span>
                  </div>
                </div>

                {/* Promo code */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t('promoCodePlaceholder')}
                    className="flex-grow bg-transparent border border-kafe-outline-variant rounded-lg px-4 py-2 text-label-sm text-kafe-on-surface placeholder:text-kafe-on-surface-variant/50 focus:border-kafe-primary outline-none transition-colors"
                  />
                  <button className="px-6 py-2 border border-kafe-primary text-kafe-primary text-label-sm rounded-lg hover:bg-kafe-primary hover:text-kafe-on-primary transition-colors">
                    {t('applyPromo')}
                  </button>
                </div>
              </div>

              {/* Trust badges */}
              <div className="bg-kafe-surface-container py-4 px-8 flex justify-center gap-6 border-t border-kafe-outline-variant/30">
                {[
                  { Icon: Lock, label: t('trustBadges.secure') },
                  { Icon: Truck, label: t('trustBadges.freeShipping') },
                  { Icon: BadgeCheck, label: t('trustBadges.warranty') },
                ].map(({ Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 text-[10px] text-kafe-on-surface-variant uppercase tracking-widest"
                  >
                    <Icon size={16} />
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
