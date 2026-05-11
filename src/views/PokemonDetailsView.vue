<template>
  <div class="container mt-5">
    
    <button
      class="button is-warning mb-5"
      @click="goBack"
    >
      ← Voltar
    </button>

    <!-- loading -->
    <div
      v-if="loading"
      class="columns is-multiline"
    >
      <div
        class="column is-4"
        v-for="n in 3"
        :key="n"
      >
        <div class="card skeleton-card"></div>
      </div>
    </div>

    <!-- erro -->
    <div v-else-if="error">
      <h2 class="title is-4 has-text-danger">
        {{ error }}
      </h2>
    </div>

    <!-- conteúdo -->
    <div
      v-else-if="pokemon"
      class="card pokemon-details-card"
    >
      <div class="card-content">

        <!-- nome -->
        <h1 class="title has-text-centered">
          {{ formatName(pokemon.name) }}
        </h1>

        <!-- badges -->
        <div class="has-text-centered mb-4">
          <span
            v-if="speciesData?.is_legendary"
            class="tag is-warning mr-2"
          >
            Legendary
          </span>

          <span
            v-if="speciesData?.is_mythical"
            class="tag is-danger"
          >
            Mythical
          </span>
        </div>

        <!-- sprites -->
        <div class="has-text-centered mb-5">
          <img
            :src="pokemon.sprites.front_default"
            alt="front"
          />

          <img
            :src="pokemon.sprites.back_default"
            alt="back"
          />

          <img
            :src="pokemon.sprites.front_shiny"
            alt="shiny"
          />
        </div>

        <!-- cry -->
        <div class="has-text-centered mb-5">
          <h3 class="subtitle">Pokémon Cry</h3>

          <audio controls>
            <source
              :src="pokemon.cries.latest"
              type="audio/ogg"
            />
          </audio>
        </div>

        <div class="content">

          <!-- tipos -->
          <h3 class="subtitle">Tipos</h3>

          <div
            v-for="type in pokemon.types"
            :key="type.type.name"
          >
            {{ type.type.name }}
          </div>

          <hr>

          <!-- stats -->
          <h3 class="subtitle">Stats</h3>

          <div
            v-for="stat in pokemon.stats"
            :key="stat.stat.name"
          >
            <strong>{{ stat.stat.name }}:</strong>
            {{ stat.base_stat }}
          </div>

          <hr>

          <!-- abilities -->
          <h3 class="subtitle">Abilities</h3>

          <div
            v-for="ability in pokemon.abilities"
            :key="ability.ability.name"
          >
            {{ ability.ability.name }}
          </div>

          <hr>

          <!-- habitat -->
          <h3 class="subtitle">Habitat</h3>

          <p>
            {{ speciesData?.habitat?.name || 'Unknown' }}
          </p>

          <hr>

          <!-- evolução -->
          <h3 class="subtitle">Evolution Chain</h3>

          <div class="tags">
            <span
              class="tag is-info is-medium"
              v-for="evolution in evolutions"
              :key="evolution"
            >
              {{ formatName(evolution) }}
            </span>
          </div>

          <hr>

          <p>
            <strong>Altura:</strong>
            {{ pokemon.height }}
          </p>

          <p>
            <strong>Peso:</strong>
            {{ pokemon.weight }}
          </p>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface PokemonAbility {
  ability: {
    name: string
  }
}

interface PokemonType {
  type: {
    name: string
  }
}

interface PokemonStat {
  base_stat: number
  stat: {
    name: string
  }
}

interface PokemonSprites {
  front_default: string
  back_default: string
  front_shiny: string
}

interface PokemonCries {
  latest: string
}

interface PokemonData {
  name: string
  height: number
  weight: number
  sprites: PokemonSprites
  cries: PokemonCries
  types: PokemonType[]
  stats: PokemonStat[]
  abilities: PokemonAbility[]
  species: {
    url: string
  }
}

interface SpeciesData {
  habitat: {
    name: string
  } | null
  is_legendary: boolean
  is_mythical: boolean
  evolution_chain: {
    url: string
  }
}

const route = useRoute()
const router = useRouter()

const pokemon = ref<PokemonData | null>(null)
const speciesData = ref<SpeciesData | null>(null)
const evolutions = ref<string[]>([])

const loading = ref(true)
const error = ref('')

const formatName = (name: string) => {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

const goBack = () => {
  router.push('/')
}

const extractEvolutionChain = (chain: any) => {
  const evolutionList = []

  let current = chain

  while (current) {
    evolutionList.push(current.species.name)
    current = current.evolves_to[0]
  }

  return evolutionList
}

onMounted(async () => {
  try {
    const pokemonName = route.params.name

    // request 1
    const pokemonRes = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    )

    pokemon.value = pokemonRes.data

    // request 2
    const speciesRes = await axios.get(
      pokemonRes.data.species.url
    )

    speciesData.value = speciesRes.data

    // request 3
    const evolutionRes = await axios.get(
      speciesRes.data.evolution_chain.url
    )

    evolutions.value = extractEvolutionChain(
      evolutionRes.data.chain
    )

  } catch (err) {
    console.error(err)
    error.value = 'Erro ao carregar detalhes do Pokémon'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.pokemon-details-card {
  max-width: 800px;
  margin: auto;
  border-radius: 20px;
}

img {
  width: 150px;
  margin: 10px;
}

.container {
  padding-bottom: 50px;
}

.skeleton-card {
  height: 300px;
  border-radius: 20px;
  background: linear-gradient(
    90deg,
    #f1f1f1 25%,
    #e5e5e5 50%,
    #f1f1f1 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>