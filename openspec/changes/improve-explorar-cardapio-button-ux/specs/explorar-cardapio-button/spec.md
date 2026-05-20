## ADDED Requirements

### Requirement: Feedback visual imediato ao clicar
O botão CTA "Explorar Cardápio" SHALL exibir um estado de loading (spinner animado + texto "Carregando…") imediatamente após o clique do usuário, enquanto a navegação para `/cardapio` é processada.

#### Scenario: Clique dispara loading state
- **WHEN** o usuário clica no botão "Explorar Cardápio"
- **THEN** o botão substitui seu conteúdo por um spinner e o texto "Carregando…" antes do redirect completar

#### Scenario: Botão desabilitado durante loading
- **WHEN** o loading state está ativo
- **THEN** o botão SHALL estar desabilitado (`disabled`) para evitar cliques duplos

### Requirement: Navegação para /cardapio
O botão SHALL navegar o usuário para `/cardapio` usando `router.push` após ativar o loading state.

#### Scenario: Redirect ocorre após loading state ativo
- **WHEN** o usuário clica no botão
- **THEN** o sistema SHALL chamar `router.push('/cardapio')` imediatamente após `setLoading(true)`

### Requirement: Isolamento como Client Component
O CTA SHALL ser implementado como um Client Component separado (`ExplorarCardapioButton`) para não converter `app/page.tsx` em Client Component.

#### Scenario: Landing page permanece Server Component
- **WHEN** `app/page.tsx` é renderizado no servidor
- **THEN** apenas `ExplorarCardapioButton` SHALL ter a diretiva `'use client'`
