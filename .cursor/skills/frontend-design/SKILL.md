---
name: frontend-design
description: Skill de design e UI para interfaces React + Tailwind. Use ao melhorar layouts, refatorar componentes, criar telas, ajustar tipografia, cores, espaçamento, responsividade, microinterações e hierarquia visual.
---

# Frontend Design Skill

Guia de design e implementação visual para interfaces web de alta qualidade com React e Tailwind CSS.

## Princípios de design

1. **Clareza antes de decoração** — cada elemento deve ter propósito
2. **Hierarquia visual** — tamanho, peso, cor e espaço guiam o olhar
3. **Consistência** — reutilize tokens, componentes e padrões existentes
4. **Mobile-first** — projete para telas pequenas, expanda para desktop
5. **Acessibilidade** — contraste WCAG AA, focus visível, labels, aria
6. **Performance visual** — animações sutis, sem layout shift, imagens otimizadas

## Antes de implementar

Leia sempre o contexto do projeto:

- `src/styles/theme.css` — tokens e design system (Essence Parfum)
- `src/app/components/ui/` — componentes base (shadcn/Radix)
- `guidelines/Guidelines.md` — regras do projeto
- Páginas e componentes relacionados à tarefa
- Design de referência (Figma, mockups) quando disponível

**Regra de ouro:** Nunca invente cores ou espaçamentos fora do design system sem justificativa.

## Design system — Essence Parfum

### Cores principais

| Token | Uso |
|-------|-----|
| `--ep-neutral-50` a `--ep-neutral-900` | Fundos, textos, bordas |
| `--ep-gold-500` / `--ep-gold-700` | Destaques, CTAs premium |
| `--ep-black-ink` | Textos de alto contraste |
| `--ep-blush-100` | Acentos suaves |
| `--ep-success` / `--ep-warning` / `--ep-error` | Feedback de estado |

### Tipografia

- Base: `16px` (`--font-size`)
- Pesos: `400` (normal), `500` (medium)
- Hierarquia: títulos com escala clara (ex: `text-3xl` → `text-sm`)
- Line-height generoso em parágrafos (`leading-relaxed`)

### Espaçamento e layout

- Use escala Tailwind consistente (`4`, `6`, `8`, `12`, `16`, `24`)
- Prefira `flex` e `grid` sobre `absolute`
- Containers com `max-w-*` e padding responsivo (`px-4 md:px-8`)
- Border radius: `--radius` (0.625rem) como padrão

## Checklist visual

### Layout
- [ ] Alinhamento consistente (grid/flex)
- [ ] Espaçamento uniforme entre seções
- [ ] Sem overflow horizontal em mobile
- [ ] Breakpoints: `sm`, `md`, `lg`, `xl` testados

### Tipografia
- [ ] Hierarquia clara (h1 > h2 > body > caption)
- [ ] Fontes carregando corretamente
- [ ] Texto legível em todos os fundos

### Cores e contraste
- [ ] Tokens do design system aplicados
- [ ] Contraste mínimo WCAG AA (4.5:1 texto normal)
- [ ] Estados hover/focus/active visíveis

### Componentes
- [ ] Reutiliza `src/app/components/ui/*` quando possível
- [ ] Variantes via `cva` + `cn()` (padrão shadcn)
- [ ] Props tipadas, componentes pequenos e focados

### Interações
- [ ] Hover, focus e disabled states
- [ ] Transições suaves (`transition-all`, `duration-200`)
- [ ] Loading states onde necessário
- [ ] Animações com `motion` apenas quando agregam valor

### Acessibilidade
- [ ] `focus-visible:ring-*` em elementos interativos
- [ ] `aria-label` / `aria-describedby` quando necessário
- [ ] Imagens com `alt` descritivo
- [ ] Navegação por teclado funcional

## Padrões de refatoração UI

### Quando refatorar um componente

1. Identifique responsabilidade única — se faz demais, divida
2. Extraia variantes repetidas para `cva`
3. Mova lógica de negócio para hooks (`src/hooks/` ou `src/lib/`)
4. Substitua classes longas por composição de componentes
5. Preserve comportamento — refatoração visual não quebra funcionalidade

### Anti-padrões a evitar

- Classes Tailwind com 15+ utilitários inline repetidos
- `useEffect` para estado derivável
- Inline styles (exceto valores dinâmicos inevitáveis)
- Cores hardcoded (`#C9A24B`) — use tokens CSS
- Componentes monolíticos de 300+ linhas
- Animações pesadas que prejudicam performance

## Formato de entrega

Ao propor melhorias de UI, estruture assim:

1. **Diagnóstico** — o que está fraco hoje (com arquivo/linha)
2. **Proposta** — mudanças visuais e estruturais
3. **Implementação** — código React + Tailwind pronto
4. **Responsividade** — comportamento por breakpoint
5. **Acessibilidade** — melhorias aplicadas

## Stack de referência

| Camada | Tecnologia |
|--------|------------|
| UI | React 18 (functional components) |
| Estilo | Tailwind CSS 4 |
| Componentes | Radix UI + shadcn patterns |
| Variantes | `class-variance-authority` + `tailwind-merge` |
| Animações | `motion` |
| Roteamento | `react-router` |
| Build | Vite 6 |
