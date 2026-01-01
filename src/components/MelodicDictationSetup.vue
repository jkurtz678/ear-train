<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const STORAGE_KEY = 'melodic-dictation-settings'

const props = defineProps({
  open: Boolean,
})

const emit = defineEmits(['start', 'close'])

const numberOfNotes = ref(8)
const isInfinite = ref(false)
const speed = ref(1)
const speedSlider = ref(100) // 0-200, with 100 = 1x
const continueOnIncorrect = ref(false)
const keyMode = ref('fixed')
const cadenceType = ref('major')
const octaves = ref({
  low: false,
  middle: true,
  high: false,
})

// Convert slider value (0-200) to speed (0.2-3)
function sliderToSpeed(sliderValue) {
  if (sliderValue <= 100) {
    // 0-100 maps to 0.2-1
    return 0.2 + (sliderValue / 100) * 0.8
  } else {
    // 100-200 maps to 1-3
    return 1 + ((sliderValue - 100) / 100) * 2
  }
}

// Convert speed (0.2-3) to slider value (0-200)
function speedToSlider(speedValue) {
  if (speedValue <= 1) {
    // 0.2-1 maps to 0-100
    return ((speedValue - 0.2) / 0.8) * 100
  } else {
    // 1-3 maps to 100-200
    return 100 + ((speedValue - 1) / 2) * 100
  }
}

// Update speed when slider changes
watch(speedSlider, (newValue) => {
  speed.value = Math.round(sliderToSpeed(newValue) * 10) / 10
})

// Update slider when speed is loaded
watch(speed, (newValue) => {
  const expectedSlider = speedToSlider(newValue)
  if (Math.abs(speedSlider.value - expectedSlider) > 0.5) {
    speedSlider.value = Math.round(expectedSlider)
  }
}, { immediate: true })

const speedDisplay = computed(() => `${speed.value.toFixed(1)}x`)

// Load settings from localStorage on mount
onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const settings = JSON.parse(saved)
      if (settings.numberOfNotes) numberOfNotes.value = settings.numberOfNotes
      if (settings.isInfinite !== undefined) isInfinite.value = settings.isInfinite
      if (settings.speed) speed.value = settings.speed
      if (settings.continueOnIncorrect !== undefined) continueOnIncorrect.value = settings.continueOnIncorrect
      if (settings.keyMode) keyMode.value = settings.keyMode
      if (settings.cadenceType) cadenceType.value = settings.cadenceType
      if (settings.octaves) octaves.value = settings.octaves
    } catch (e) {
      console.warn('Failed to load settings from localStorage')
    }
  }
})

function saveSettings() {
  const settings = {
    numberOfNotes: numberOfNotes.value,
    isInfinite: isInfinite.value,
    speed: speed.value,
    continueOnIncorrect: continueOnIncorrect.value,
    keyMode: keyMode.value,
    cadenceType: cadenceType.value,
    octaves: octaves.value,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

function handleStart() {
  // Ensure at least one octave is selected
  const selectedOctaves = Object.entries(octaves.value)
    .filter(([_, selected]) => selected)
    .map(([octave]) => octave)

  if (selectedOctaves.length === 0) {
    selectedOctaves.push('middle')
    octaves.value.middle = true
  }

  // Save to localStorage
  saveSettings()

  emit('start', {
    numberOfNotes: isInfinite.value ? Infinity : numberOfNotes.value,
    isInfinite: isInfinite.value,
    speed: speed.value,
    continueOnIncorrect: continueOnIncorrect.value,
    keyMode: keyMode.value,
    cadenceType: cadenceType.value,
    octaves: selectedOctaves,
  })
}
</script>

<template>
  <Dialog :open="open" @update:open="(val) => !val && emit('close')">
    <DialogContent class="sm:max-w-md bg-card" @pointerDownOutside.prevent>
      <DialogHeader class="mb-6">
        <DialogTitle class="text-xl font-medium tracking-heading">Melodic Dictation Setup</DialogTitle>
      </DialogHeader>

      <div class="flex flex-col gap-6 mb-6">
        <!-- Number of Notes -->
        <div class="flex flex-col gap-3">
          <Label class="text-sm font-normal text-muted-foreground tracking-caps uppercase">Number of Notes</Label>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <Checkbox id="infinite" v-model="isInfinite" />
              <Label for="infinite" class="font-light cursor-pointer">Infinite</Label>
            </div>
            <div v-if="!isInfinite" class="flex items-center gap-2">
              <input
                type="number"
                v-model.number="numberOfNotes"
                min="2"
                max="100"
                class="w-20 px-3 py-2 border border-border rounded-md text-center bg-card text-foreground font-light focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <span class="text-sm text-muted-foreground font-light">notes</span>
            </div>
          </div>
        </div>

        <!-- Speed -->
        <div class="flex flex-col gap-3">
          <Label class="text-sm font-normal text-muted-foreground tracking-caps uppercase">Speed: {{ speedDisplay }}</Label>
          <input
            type="range"
            v-model.number="speedSlider"
            min="0"
            max="200"
            step="1"
            class="w-full accent-primary"
          />
          <div class="relative text-xs text-muted-foreground font-light h-4">
            <span class="absolute left-0">0.2x (slower)</span>
            <span class="absolute left-1/2 -translate-x-1/2">1x</span>
            <span class="absolute right-0">3x (faster)</span>
          </div>
        </div>

        <!-- Continue on Incorrect -->
        <div class="flex flex-col gap-3">
          <Label class="text-sm font-normal text-muted-foreground tracking-caps uppercase">On Incorrect Guess</Label>
          <RadioGroup v-model="continueOnIncorrect" class="flex gap-6">
            <div class="flex items-center gap-2">
              <RadioGroupItem id="retry" :value="false" />
              <Label for="retry" class="font-light cursor-pointer">Keep guessing</Label>
            </div>
            <div class="flex items-center gap-2">
              <RadioGroupItem id="continue" :value="true" />
              <Label for="continue" class="font-light cursor-pointer">Move to next</Label>
            </div>
          </RadioGroup>
        </div>

        <!-- Key Mode -->
        <div class="flex flex-col gap-3">
          <Label class="text-sm font-normal text-muted-foreground tracking-caps uppercase">Key Mode</Label>
          <RadioGroup v-model="keyMode" class="flex gap-6">
            <div class="flex items-center gap-2">
              <RadioGroupItem id="fixed" value="fixed" />
              <Label for="fixed" class="font-light cursor-pointer">Fixed Key</Label>
            </div>
            <div class="flex items-center gap-2">
              <RadioGroupItem id="random" value="random" />
              <Label for="random" class="font-light cursor-pointer">Random Keys</Label>
            </div>
          </RadioGroup>
        </div>

        <!-- Cadence Type -->
        <div class="flex flex-col gap-3">
          <Label class="text-sm font-normal text-muted-foreground tracking-caps uppercase">Cadence Type</Label>
          <RadioGroup v-model="cadenceType" class="flex gap-6">
            <div class="flex items-center gap-2">
              <RadioGroupItem id="major" value="major" />
              <Label for="major" class="font-light cursor-pointer">Major</Label>
            </div>
            <div class="flex items-center gap-2">
              <RadioGroupItem id="minor" value="minor" />
              <Label for="minor" class="font-light cursor-pointer">Minor</Label>
            </div>
          </RadioGroup>
        </div>

        <!-- Octaves -->
        <div class="flex flex-col gap-3">
          <Label class="text-sm font-normal text-muted-foreground tracking-caps uppercase">Octaves</Label>
          <div class="flex gap-6">
            <div class="flex items-center gap-2">
              <Checkbox id="low" v-model="octaves.low" />
              <Label for="low" class="font-light cursor-pointer">Low</Label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox id="middle" v-model="octaves.middle" />
              <Label for="middle" class="font-light cursor-pointer">Middle</Label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox id="high" v-model="octaves.high" />
              <Label for="high" class="font-light cursor-pointer">High</Label>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button @click="handleStart" class="w-full">Done</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
