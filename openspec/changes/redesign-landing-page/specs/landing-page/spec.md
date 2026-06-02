## ADDED Requirements

### Requirement: Design tokens em vez de cores hardcoded
A landing page (`app/page.tsx`) SHALL usar exclusivamente tokens do design system Kafe (`kafe-surface`, `kafe-primary`, `kafe-on-surface`, `kafe-secondary-container`, etc.) — nenhum valor hex literal ou classe de cor genérica do Tailwind (ex.: `text-gray-600`, `bg-[#FDF6EE]`) é permitido nos elementos da página.

#### Scenario: Fundo da página usa token de superfície
- **WHEN** a landing page é renderizada
- **THEN** o elemento raiz SHALL ter a classe `bg-kafe-surface`

#### Scenario: Cor do texto principal usa token primário
- **WHEN** o headline "Kafe" é renderizado
- **THEN** ele SHALL ter a classe `text-kafe-primary`

### Requirement: Animações de entrada escalonadas
Os elementos do hero SHALL aparecer com animação `fade-in-up` (opacidade 0→1 + translateY 20px→0) escalonada, na ordem: ícone (delay 0.1s) → headline (0.3s) → descrição (0.5s) → pills (0.7s) → CTA (0.9s).

#### Scenario: Keyframe definido em globals.css
- **WHEN** o arquivo `app/globals.css` é carregado
- **THEN** ele SHALL conter a regra `@keyframes fadeInUp` com propriedades `opacity: 1` e `transform: translateY(0)` no estado `to`

#### Scenario: Elementos iniciam invisíveis e animam ao carregar
- **WHEN** a página carrega no navegador
- **THEN** cada elemento do hero SHALL começar com `opacity: 0` e transicionar para `opacity: 1` dentro do seu delay configurado

### Requirement: Seção "Nosso Cardápio" como alvo de scroll
A página SHALL conter uma seção com `id="menu"` abaixo do hero, com o título "Nosso Cardápio" e três cards placeholder (Clássicos, Especiais, Acompanhamentos), usando tokens `kafe-surface-container-low` e `rounded-2xl`.

#### Scenario: Seção acessível via âncora
- **WHEN** o usuário clica no link "Cardápio" no nav
- **THEN** o navegador SHALL rolar até o elemento com `id="menu"`

#### Scenario: Cards usam tokens do design system
- **WHEN** os três cards placeholder são renderizados
- **THEN** cada card SHALL ter `bg-kafe-surface-container-low` (ou `bg-stone-50` como fallback) e border `rounded-2xl`

### Requirement: Ícone de café inline SVG
O hero SHALL exibir um ícone de xícara de café como SVG inline (traço branco sobre fundo `bg-kafe-primary`) no lugar do componente `<Coffee />` do lucide-react.

#### Scenario: Ícone renderiza sem dependência de biblioteca de ícones
- **WHEN** a landing page é renderizada no servidor
- **THEN** o ícone SHALL ser um elemento `<svg>` inline, sem importação de lucide-react ou Material Symbols
