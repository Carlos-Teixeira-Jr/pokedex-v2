<template>
  <div class="pokemon-wrapper">
    <div class="card pokemon-card">

      <!-- imagem -->
      <div class="card-image">
        <figure class="image is-square">
          <img
            :src="currentImg"
            :alt="props.name"
            class="pokemon-image"
          />
        </figure>
      </div>

      <!-- conteúdo -->
      <div class="card-content">

        <div class="has-text-centered mb-4">
          <p class="pokemon-number">
            #{{ num }}
          </p>

          <h2 class="title is-4 mb-2">
            {{ upper }}
          </h2>

          <span class="tag is-info is-light pokemon-type">
            {{ pokemon.type }}
          </span>
        </div>

        <!-- ações -->
        <div class="buttons is-centered">
          <button
            class="button is-light action-btn"
            @click="mudarSprite"
          >
            Trocar Sprite
          </button>

          <button
            class="button is-dark action-btn"
            @click="goToDetails"
          >
            Ver Detalhes
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, computed, onMounted } from 'vue'
import type { PokemonDetails } from '../types/pokemon'
import { useRouter } from 'vue-router'

interface Props {
  num: number
  name: string
  url: string
}

const props = defineProps<Props>()

const isFront = ref(true)
const currentImg = ref('')
const router = useRouter()

const goToDetails = () => {
  router.push(`/pokemon/${props.name}`)
}

const pokemon = ref<PokemonDetails>({
  type: '',
  front: '',
  back: ''
})

const upper = computed(() => {
  return props.name[0].toUpperCase() + props.name.slice(1)
})

const mudarSprite = () => {
  if (isFront.value) {
    currentImg.value = pokemon.value.back
  } else {
    currentImg.value = pokemon.value.front
  }

  isFront.value = !isFront.value
}

onMounted(async () => {
  try {
    const res = await axios.get(props.url)

    pokemon.value.type = res.data.types[0].type.name
    pokemon.value.front = res.data.sprites.front_default
    pokemon.value.back = res.data.sprites.back_default

    currentImg.value = pokemon.value.front
  } catch (error) {
    console.error(error)
  }
})
</script>

<style scoped>
.pokemon-wrapper {
  height: 100%;
}

.pokemon-card {
  height: 100%;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  transition: all 0.25s ease;
  border: none;
}

.pokemon-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 35px rgba(0,0,0,0.12);
}

.pokemon-image {
  object-fit: contain;
  padding: 20px;
}

.pokemon-number {
  color: #6b7280;
  font-size: 14px;
  font-weight: 600;
}

.pokemon-type {
  font-weight: 600;
  text-transform: capitalize;
}

.action-btn {
  border-radius: 10px;
  width: 100%;
}

.buttons {
  display: flex;
  flex-direction: column;
}
</style>