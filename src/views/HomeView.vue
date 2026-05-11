<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import Pokemon from '../components/Pokemon.vue'

interface PokemonListItem {
  name: string
  url: string
}

interface PokemonTypeResponse {
  pokemon: {
    pokemon: {
      name: string
      url: string
    }
  }[]
}

const pokemons = ref<PokemonListItem[]>([])
const loading = ref(true)

const busca = ref('')
const selectedType = ref('')
const sortBy = ref('number')

const pokemonTypes = [
  'fire',
  'water',
  'grass',
  'electric',
  'psychic',
  'rock',
  'ground',
  'ghost',
  'dragon',
  'normal',
  'fighting',
  'bug',
  'poison',
  'ice',
  'fairy'
]

// busca inicial dos 151
const fetchPokemons = async () => {
  try {
    loading.value = true

    const res = await axios.get(
      'https://pokeapi.co/api/v2/pokemon?limit=151'
    )

    pokemons.value = res.data.results
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// filtro por tipo
const fetchByType = async (type: string) => {
  try {
    loading.value = true

    const res = await axios.get<PokemonTypeResponse>(
      `https://pokeapi.co/api/v2/type/${type}`
    )

    const firstGenPokemons = res.data.pokemon
      .map(item => item.pokemon)
      .filter(pokemon => {
        const id = pokemon.url.split('/')[6]
        return Number(id) <= 151
      })

    pokemons.value = firstGenPokemons
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// observar mudança de tipo
watch(selectedType, async (newType) => {
  if (!newType) {
    await fetchPokemons()
  } else {
    await fetchByType(newType)
  }
})

// busca + ordenação
const filteredPokemons = computed(() => {
  let result = [...pokemons.value]

  // busca
  if (busca.value.trim()) {
    result = result.filter(p =>
      p.name.includes(busca.value.toLowerCase())
    )
  }

  // ordenação
  if (sortBy.value === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  }

  return result
})

onMounted(() => {
  fetchPokemons()
})
</script>

<template>
  <section class="section home-background">
    <div class="container">

      <!-- Hero -->
      <div class="has-text-centered mb-6">
        <h1 class="title is-1 has-text-dark main-title">
          Pokédex
        </h1>

        <p class="subtitle has-text-grey">
          Explore os primeiros 151 Pokémon
        </p>
      </div>

      <!-- filtros -->
      <div class="box filters-box mb-6">

        <!-- busca -->
        <div class="field mb-4">
          <label class="label">Buscar Pokémon</label>
          <div class="control">
            <input
              v-model="busca"
              class="input is-medium"
              placeholder="Ex: pikachu"
            />
          </div>
        </div>

        <!-- tipo -->
        <div class="field mb-4">
          <label class="label">Filtrar por tipo</label>
          <div class="control">
            <div class="select is-fullwidth">
              <select v-model="selectedType">
                <option value="">
                  Todos os tipos
                </option>

                <option
                  v-for="type in pokemonTypes"
                  :key="type"
                  :value="type"
                >
                  {{ type }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- ordenação -->
        <div class="field">
          <label class="label">Ordenar por</label>
          <div class="control">
            <div class="select is-fullwidth">
              <select v-model="sortBy">
                <option value="number">
                  Número
                </option>

                <option value="name">
                  Nome
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- contador -->
      <div class="mb-5">
        <p class="has-text-grey">
          {{ filteredPokemons.length }} Pokémon encontrados
        </p>
      </div>

      <!-- loading skeleton -->
      <div
        v-if="loading"
        class="columns is-multiline"
      >
        <div
          class="column is-4-desktop is-6-tablet is-12-mobile"
          v-for="n in 6"
          :key="n"
        >
          <div class="card skeleton-card"></div>
        </div>
      </div>

      <!-- grid -->
      <div
        v-else
        class="columns is-multiline is-variable is-5"
      >
        <div
          class="column is-4-desktop is-6-tablet is-12-mobile"
          v-for="(poke, index) in filteredPokemons"
          :key="poke.name"
        >
          <Pokemon
            :name="poke.name"
            :url="poke.url"
            :num="index + 1"
          />
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.home-background {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    #f8fafc,
    #eef2ff
  );
}

.main-title {
  font-weight: 800;
  letter-spacing: -1px;
}

.filters-box {
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
}

.skeleton-card {
  height: 320px;
  border-radius: 20px;
  background: linear-gradient(
    90deg,
    #f1f1f1 25%,
    #e5e5e5 50%,
    #f1f1f1 75%
  );
  background-size: 200% 100%;
  animation: loading 1.4s infinite;
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