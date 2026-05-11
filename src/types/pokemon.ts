export interface PokemonListItem {
  name: string
  url: string
}

export interface PokemonApiResponse {
  results: PokemonListItem[]
}

export interface PokemonDetails {
  type: string
  front: string
  back: string
}