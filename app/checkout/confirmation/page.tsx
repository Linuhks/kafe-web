import Link from 'next/link'
import { ArrowLeft, ChevronRight, CircleCheck, HelpCircle } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import TopNavBar from '@/components/layout/TopNavBar'
import Footer from '@/components/layout/Footer'
import ItemThumbnail from '@/components/confirmation/ItemThumbnail'

const DEMO_ORDER = {
  id: '#KF-88291',
  estimatedReady: '09:45 AM',
  status: 'received' as const,
  items: [
    {
      id: 1,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC9BG29B6ob8WabxNEw4WS-8pb7VDfR4Wna_fKNdvTIEuljzSY_ECssmHmXis6jo1VRm2-okFJUqkgrl5t86HdKC612YHqF6zDP1W9CbswIq9CcOpCX3s9Q0aj3z2sSmFGOGtUnItxv3kVVQiGBiGTegsRixpQX_GwcCCKlBmEF0bZcgMS-z9yRRHeCSPY330yAxWKkLDscNudLuF78VhCAUD5EwLd5u0oo1b4TVZwSs1Pjtp2aYw2oo1djJwF_9Sr0FjAg85mIJSA',
      name: 'Ethiopia Yirgacheffe',
      detail: '250g • Whole Bean',
      price: 'R$ 18,00',
    },
    {
      id: 2,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCZyn6yLIjxU7sjVCFc_dQrnQWIY0doo2rBXkPgX2XwqWIApPNXVDyJYEjPLm4k1LAXFWjOCtquLF-oOm04y1S7a2DVsqzgdNk7Jf119nClX95T4fPwS1utp4Hg_bCErnIqw5bHkOBU9Sq_qitL6w10dgMaPX1-qw7BNXYZ0fDOGELqbJSrpLswgHwHSAHdXpwyynyG3ScYKI6hg-PuOGVu38UOLK02RnuCxk6dtHvRNtmPBiNziVRKkm-rskRa53Z2wwu3M-AugGM',
      name: 'Signature Oat Latte',
      detail: 'Large • Extra Shot',
      price: 'R$ 6,50',
    },
  ],
  subtotal: 'R$ 24,50',
  tax: 'R$ 1,96',
  total: 'R$ 26,46',
  pickup: {
    name: 'Kafe Roastery Central',
    address: '124 Ritual Way, Artisans Quarter, Brooklyn',
    mapImageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDU19uAVt9TwexA4acmpuDf1BAjqeQF0fidn-FBee1QROJDy84OuhoM6bQqeYETNBuhqVjwt7neuID-02xcqK7OLKCAToCmad8fcJT0wtPWD9QK7_dgfl64dLw1LgGyM3Z0pdS_R8hyyS38Lm-qJLd3QmZ9cYkkGPdQ_Qi27OCkLWlnhBi4tQnJWvCk0Mp7uFoGHe1faQWFg3QnlUJON2TSK-2u0-DyE0eTtDcBr9JqvTIiiAW3wUS8QgyNBXvbb8Tkw0QNl736fP4',
  },
}

const STATUS_STEPS = ['received', 'roasting', 'ready'] as const

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>
}) {
  await searchParams
  // Real app: const { orderId } = await searchParams; order = await fetchOrder(orderId)
  const order = DEMO_ORDER
  const t = await getTranslations('orderConfirmation')

  return (
    <div className="min-h-screen bg-kafe-surface">
      <TopNavBar />

      <main className="max-w-4xl mx-auto px-margin-page py-stack-lg">

        {/* Success hero */}
        <section className="text-center mb-stack-lg">
          <div className="mb-stack-md inline-flex items-center justify-center w-24 h-24 bg-kafe-secondary-container rounded-full animate-float">
            <CircleCheck className="text-kafe-on-secondary-container" size={48} strokeWidth={1.5} />
          </div>
          <h1 className="text-headline-lg text-kafe-primary mb-stack-sm">
            {t('hero.headline')}
          </h1>
          <p className="text-body-lg text-kafe-on-surface-variant max-w-lg mx-auto">
            {t('hero.body')}
          </p>
        </section>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter-grid">

          {/* Left column: order status + order summary */}
          <div className="md:col-span-7 flex flex-col gap-gutter-grid">

            {/* Status card */}
            <div className="bg-kafe-surface-container-lowest border border-kafe-outline-variant rounded-xl p-8 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-label-sm text-kafe-on-surface-variant uppercase tracking-widest mb-1">
                    {t('status.estimatedReadyLabel')}
                  </p>
                  <p className="text-headline-md text-kafe-primary">{order.estimatedReady}</p>
                </div>
                <div className="text-right">
                  <p className="text-label-sm text-kafe-on-surface-variant uppercase tracking-widest mb-1">
                    {t('status.orderIdLabel')}
                  </p>
                  <p className="text-body-md font-bold text-kafe-on-surface">{order.id}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative w-full h-2 bg-kafe-surface-container rounded-full overflow-hidden mb-4">
                <div className="absolute left-0 top-0 h-full w-1/3 bg-kafe-primary rounded-full" />
              </div>

              {/* Step labels */}
              <div className="flex justify-between">
                {STATUS_STEPS.map((step) => (
                  <span
                    key={step}
                    className={`text-label-sm ${
                      step === order.status
                        ? 'text-kafe-primary font-bold'
                        : 'text-kafe-on-surface-variant'
                    }`}
                  >
                    {t(`statusSteps.${step}`)}
                  </span>
                ))}
              </div>
            </div>

            {/* Order summary card */}
            <div className="bg-kafe-surface-container-lowest border border-kafe-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-kafe-outline-variant">
                <h2 className="text-headline-md text-kafe-on-surface">{t('orderSummary.title')}</h2>
              </div>

              <div className="divide-y divide-kafe-outline-variant">
                {order.items.map((item) => (
                  <div key={item.id} className="p-6 flex items-center gap-4">
                    <ItemThumbnail src={item.imageUrl} alt={item.name} />
                    <div className="flex-grow">
                      <h3 className="text-body-md font-bold text-kafe-on-surface">{item.name}</h3>
                      <p className="text-label-sm text-kafe-on-surface-variant">{item.detail}</p>
                    </div>
                    <span className="text-body-md font-bold text-kafe-primary">{item.price}</span>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="p-6 bg-kafe-surface-container-low">
                <div className="flex justify-between mb-2">
                  <span className="text-body-md text-kafe-on-surface-variant">{t('orderSummary.subtotal')}</span>
                  <span className="text-body-md text-kafe-on-surface">{order.subtotal}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-body-md text-kafe-on-surface-variant">{t('orderSummary.taxes')}</span>
                  <span className="text-body-md text-kafe-on-surface">{order.tax}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-kafe-outline-variant">
                  <span className="text-headline-md text-kafe-on-surface">{t('orderSummary.total')}</span>
                  <span className="text-headline-md text-kafe-primary">{order.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: pickup location + support */}
          <div className="md:col-span-5 flex flex-col gap-gutter-grid">

            {/* Pickup location card */}
            <div className="bg-kafe-surface-container-lowest border border-kafe-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="h-48 w-full relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={order.pickup.mapImageUrl}
                  alt={t('pickup.mapAlt')}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-kafe-surface-container-lowest/80 to-transparent" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-headline-md text-kafe-primary mb-2">{t('pickup.title')}</h2>
                <p className="text-body-md font-bold text-kafe-on-surface">{order.pickup.name}</p>
                <p className="text-body-md text-kafe-on-surface-variant mb-4">{order.pickup.address}</p>
                <button className="w-full py-4 bg-kafe-primary text-kafe-on-primary rounded-lg text-label-sm uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-auto">
                  <span>{t('pickup.getDirections')}</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Support card */}
            <div className="bg-kafe-secondary-container/10 border border-kafe-secondary-container rounded-xl p-6 flex items-start gap-4">
              <HelpCircle className="text-kafe-secondary flex-shrink-0" size={24} />
              <div>
                <h4 className="text-body-md font-bold text-kafe-on-secondary-container">
                  {t('support.heading')}
                </h4>
                <p className="text-label-sm text-kafe-on-secondary-container/80 mt-1">
                  {t('support.body')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-stack-lg flex flex-col md:flex-row items-center justify-center gap-4">
          <Link
            href="/cardapio"
            className="text-label-sm text-kafe-on-surface-variant hover:text-kafe-primary transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            {t('footer.returnToShop')}
          </Link>
          <div className="hidden md:block w-px h-4 bg-kafe-outline-variant" />
          <button className="px-8 py-4 bg-kafe-surface-container-high text-kafe-primary rounded-full text-label-sm uppercase tracking-widest hover:bg-kafe-surface-container-highest transition-colors">
            {t('footer.downloadReceipt')}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
