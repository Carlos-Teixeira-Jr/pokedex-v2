import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PokemonDetailsView from '../views/PokemonDetailsView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/pokemon/:name',
    name: 'pokemon-details',
    component: PokemonDetailsView,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router