# 🔥 Pokédex V2

Aplicação web desenvolvida com **Vue 3 + TypeScript + Vite** consumindo a API pública da **PokeAPI**, permitindo explorar os primeiros 151 Pokémon de forma interativa.

O projeto evoluiu de uma listagem simples para uma aplicação com foco em **UX moderna**, componentização e consumo de múltiplos endpoints REST.

---

## Preview

### Home

- Busca em tempo real
- Filtro por tipo
- Ordenação por nome/número
- Grid responsivo
- Loading skeleton

### Página de detalhes

- Sprites do Pokémon
- Tipos
- Stats
- Abilities
- Altura e peso
- Navegação entre páginas

# Tecnologias utilizadas

- Vue 3
- TypeScript
- Vite
- Vue Router
- Axios
- Bulma CSS
- PokeAPI

---

# Conceitos aplicados

## Componentização

Separação clara entre os componentes:

- HomeView
- Pokemon Card
- Details View

---

## Consumo de APIs REST

Consumo de múltiplos endpoints:

```bash
GET /pokemon
GET /pokemon/:name
GET /type/:type
```

## Reactive State Management

Utilização de recursos da Composition API:

- ref()
- computed()
- onMounted()

## Reactive State Management

Tipagem forte com TypeScript:

Criação de interfaces para:

- Pokémon
- Stats
- Types
- Abilities
- Sprites

## Navegação dinâmica

Rotas dinâmicas utilizando Vue Router:

```bash
GET /pokemon/:name
```

---

## Autor

Desenvolvido por Carlos Teixeira

[LinkedIn](https://www.linkedin.com/in/carlos-teixeira-000b7b1a0)
[Portfólio](https://carlos-teixeira-portfolio.vercel.app/)
