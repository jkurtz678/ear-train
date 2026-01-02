import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../components/LandingPage.vue'
import EarTrainer from '../components/EarTrainer.vue'
import MelodicDictation from '../components/MelodicDictation.vue'
import MelodicDictationSetupPage from '../components/MelodicDictationSetupPage.vue'
import ScaleDegreesSetup from '../components/ScaleDegreesSetup.vue'
import ScaleDegreesResults from '../components/ScaleDegreesResults.vue'
import ScaleDegreesExercise from '../components/ScaleDegreesExercise.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: LandingPage,
  },
  // Old route (kept for backwards compatibility)
  {
    path: '/scale-degrees',
    name: 'scale-degrees',
    component: EarTrainer,
  },
  // New routes for refactored functional scale degrees
  {
    path: '/scale-degrees/setup',
    name: 'scale-degrees-setup',
    component: ScaleDegreesSetup,
  },
  {
    path: '/scale-degrees/exercise',
    name: 'scale-degrees-exercise',
    component: ScaleDegreesExercise,
  },
  {
    path: '/scale-degrees/results',
    name: 'scale-degrees-results',
    component: ScaleDegreesResults,
  },
  // Melodic Dictation routes
  {
    path: '/melodic-dictation/setup',
    name: 'melodic-dictation-setup',
    component: MelodicDictationSetupPage,
  },
  {
    path: '/melodic-dictation',
    name: 'melodic-dictation',
    component: MelodicDictation,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
