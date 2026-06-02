## MODIFIED Requirements

### Requirement: Isolamento como Client Component
O CTA SHALL ser implementado como um Client Component separado (`ExplorarCardapioButton`) para não converter `app/page.tsx` em Client Component. O botão SHALL usar tokens de cor do design system (`bg-kafe-primary`, `text-kafe-on-primary`) em vez de valores hex hardcoded.

#### Scenario: Landing page permanece Server Component
- **WHEN** `app/page.tsx` é renderizado no servidor
- **THEN** apenas `ExplorarCardapioButton` SHALL ter a diretiva `'use client'`

#### Scenario: Botão usa tokens de cor
- **WHEN** o botão é renderizado
- **THEN** ele SHALL ter as classes `bg-kafe-primary` e `text-kafe-on-primary` (sem hex literals)
