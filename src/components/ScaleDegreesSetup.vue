<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Settings } from 'lucide-vue-next'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { usePiano } from '@/composables/usePiano'

const router = useRouter()
const { currentPianoId, switchPiano, getPianoTypeList } = usePiano()
const pianoTypes = getPianoTypeList()

const STORAGE_KEY = 'ear-trainer-settings'

// Setup state
const numberOfQuestions = ref(10)
const keyMode = ref('fixed')
const cadenceType = ref('major')
const octaves = ref({
  low: false,
  middle: true,
  high: false,
})
const walkToRoot = ref(true)
const showSettingsModal = ref(false)

// Note selection state
const enabledNotes = ref({ 0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true })

// Solfege labels for current mode (7 unique notes)
const solfege = computed(() => cadenceType.value === 'major'
  ? ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Ti']
  : ['La', 'Ti', 'Do', 'Re', 'Mi', 'Fa', 'Sol'])

// Note selection helpers
function getEnabledCount() {
  return Object.values(enabledNotes.value).filter(Boolean).length
}

function toggleNote(index) {
  // Can always enable, but only disable if more than 2 enabled
  if (enabledNotes.value[index] && getEnabledCount() <= 2) {
    return
  }
  enabledNotes.value[index] = !enabledNotes.value[index]
}

// Settings summary for display - returns array for custom rendering
const settingsSummaryParts = computed(() => {
  const parts = []

  // Key mode + Cadence type combined
  const keyModeText = keyMode.value === 'fixed' ? 'Fixed' : 'Random'
  const modeText = cadenceType.value === 'major' ? 'Major' : 'Minor'
  parts.push(`${keyModeText} ${modeText}`)

  // Octaves
  const selectedOctaves = Object.entries(octaves.value)
    .filter(([_, selected]) => selected)
    .map(([octave]) => octave.charAt(0).toUpperCase() + octave.slice(1))

  if (selectedOctaves.length === 3) {
    parts.push('All octaves')
  } else if (selectedOctaves.length === 1) {
    parts.push(selectedOctaves[0] + ' octave')
  } else if (selectedOctaves.length > 0) {
    parts.push(selectedOctaves.join(' & ') + ' octaves')
  }

  // Walk to root
  if (walkToRoot.value) {
    parts.push('Walk to root')
  }

  return parts
})

// Load settings from localStorage on mount
onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const settings = JSON.parse(saved)
      if (settings.numberOfQuestions) {
        // Clamp to valid range (5-50, steps of 5)
        const num = Math.max(5, Math.min(50, settings.numberOfQuestions))
        numberOfQuestions.value = Math.round(num / 5) * 5
      }
      if (settings.keyMode) keyMode.value = settings.keyMode
      if (settings.cadenceType) cadenceType.value = settings.cadenceType
      if (settings.octaves) octaves.value = settings.octaves
      if (settings.walkToRoot !== undefined) walkToRoot.value = settings.walkToRoot
      if (settings.enabledNotes) enabledNotes.value = settings.enabledNotes
    } catch (e) {
      console.warn('Failed to load settings from localStorage')
    }
  }
})

function handleSettingsSave() {
  // Ensure at least one octave is selected
  const selectedOctaves = Object.entries(octaves.value)
    .filter(([_, selected]) => selected)
    .map(([octave]) => octave)

  if (selectedOctaves.length === 0) {
    octaves.value.middle = true
  }

  showSettingsModal.value = false
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
  const settings = {
    numberOfQuestions: numberOfQuestions.value,
    keyMode: keyMode.value,
    cadenceType: cadenceType.value,
    octaves: octaves.value,
    walkToRoot: walkToRoot.value,
    enabledNotes: enabledNotes.value,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))

  // Navigate to exercise
  router.push({
    name: 'scale-degrees-exercise'
  })
}
</script>

<template>
  <div>
  <!-- Settings Modal -->
  <Dialog :open="showSettingsModal" @update:open="(val) => showSettingsModal = val">
    <DialogContent class="sm:max-w-md bg-card" @pointerDownOutside.prevent>
      <DialogHeader class="mb-6">
        <DialogTitle class="text-xl font-medium tracking-heading">Test Configuration</DialogTitle>
      </DialogHeader>

      <div class="flex flex-col gap-6 mb-6">
        <div class="flex flex-col gap-3">
          <Label class="text-sm font-normal text-muted-foreground tracking-caps uppercase">Piano Sound</Label>
          <select
            :value="currentPianoId"
            @change="(e) => switchPiano(e.target.value)"
            class="piano-select"
          >
            <option v-for="piano in pianoTypes" :key="piano.id" :value="piano.id">
              {{ piano.displayName }}
            </option>
          </select>
        </div>

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

        <div class="flex flex-col gap-3">
          <Label class="text-sm font-normal text-muted-foreground tracking-caps uppercase">After Correct Guess</Label>
          <div class="flex items-center gap-2">
            <Checkbox id="walkToRoot" v-model="walkToRoot" />
            <Label for="walkToRoot" class="font-light cursor-pointer">Play walk to root</Label>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button @click="handleSettingsSave" class="w-full">Done</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <div class="page">
    <div class="card">
      <!-- Header -->
      <div class="header">
        <button class="back-btn" @click="router.push('/')">
          <ArrowLeft :size="20" />
          <span>Back</span>
        </button>
      </div>

      <!-- Title -->
      <div class="title-section">
        <h1 class="title">Scale Degrees</h1>
        <p class="subtitle">Setup your practice session</p>
      </div>

      <!-- Streamlined Settings -->
      <div class="settings-simple">
        <!-- Number of Questions Card -->
        <div class="config-card">
          <div class="config-content">
            <span class="config-label">Number of Questions</span>
            <div class="slider-container">
              <input
                v-model.number="numberOfQuestions"
                type="range"
                min="5"
                max="50"
                step="5"
                class="slider"
              />
              <span class="slider-value">{{ numberOfQuestions }}</span>
            </div>
          </div>
        </div>

        <!-- Note Selection Card -->
        <div class="config-card">
          <div class="config-content">
            <span class="config-label">Notes to Practice</span>
            <div class="note-squares">
              <button
                v-for="(note, index) in solfege"
                :key="index"
                class="note-square"
                :class="{
                  enabled: enabledNotes[index],
                  disabled: !enabledNotes[index],
                  'cannot-disable': enabledNotes[index] && getEnabledCount() <= 2
                }"
                @click="toggleNote(index)"
              >
                {{ note.slice(0, 2) }}
              </button>
            </div>
          </div>
        </div>

        <!-- Test Configuration Card -->
        <div class="config-card clickable" @click="showSettingsModal = true">
          <div class="config-content">
            <span class="config-label">Other settings</span>
            <div class="config-summary">
              <template v-for="(part, index) in settingsSummaryParts" :key="index">
                <span class="summary-item">{{ part }}</span>
                <span v-if="index < settingsSummaryParts.length - 1" class="summary-separator">·</span>
              </template>
            </div>
          </div>
          <Settings :size="20" class="config-icon" />
        </div>
      </div>

      <!-- Start Button -->
      <div class="start-section">
        <button class="start-btn" @click="handleStart">
          Start Practice
        </button>
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #e8e4e0;
}

.card {
  background: linear-gradient(180deg, #f5f3f0 0%, #ebe7e3 100%);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 0.95rem;
  font-weight: 400;
  border: none;
  background: none;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;
  margin-left: -12px;
}

.back-btn:hover {
  color: #444;
}

.title-section {
  text-align: center;
}

.title {
  font-size: 1.75rem;
  margin: 0 0 8px 0;
  font-weight: 300;
  color: #3d3d3d;
}

.subtitle {
  color: #888;
  font-size: 0.95rem;
  font-weight: 300;
  margin: 0;
}

.settings-simple {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 0 auto;
  width: 100%;
  max-width: 500px;
}

.config-card {
  background: white;
  border: none;
  border-radius: 8px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s;
}

.config-card.clickable {
  cursor: pointer;
}

.config-card.clickable:hover {
  background: #F0EBE5;
}

.config-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.config-label {
  font-size: 0.75rem;
  color: #888;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.config-summary {
  font-size: 0.95rem;
  color: #444;
  font-weight: 300;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
}

.summary-item {
  white-space: nowrap;
}

.summary-separator {
  color: #B8956D;
  font-size: 1.2rem;
  font-weight: 500;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e0dcd8;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #B8956D;
  cursor: pointer;
  transition: all 0.2s;
}

.slider::-webkit-slider-thumb:hover {
  background: #A6845E;
  transform: scale(1.1);
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #B8956D;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.slider::-moz-range-thumb:hover {
  background: #A6845E;
  transform: scale(1.1);
}

.slider-value {
  font-size: 0.95rem;
  color: #444;
  font-weight: 400;
  min-width: 30px;
  text-align: right;
}

.config-icon {
  color: #888;
  transition: color 0.2s;
}

.start-section {
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.start-btn {
  background: #B8956D;
  color: white;
  padding: 14px 48px;
  font-size: 1.1rem;
  font-weight: 400;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.02em;
}

.start-btn:hover {
  background: #A6845E;
}

/* Mobile responsive styles */
@media (max-width: 500px) {
  .page {
    padding: 0;
    align-items: flex-start;
    background: #f5f3f0;
  }

  .card {
    border-radius: 0;
    padding: 24px 16px;
    padding-top: calc(24px + env(safe-area-inset-top, 0px));
    min-height: 100dvh;
    min-height: 100dvh;
    box-shadow: none;
  }

  .title {
    font-size: 1.5rem;
  }

  .config-card {
    padding: 14px 16px;
  }

  .start-btn {
    width: 100%;
    padding: 14px 24px;
  }
}

.piano-select {
  padding: 10px 36px 10px 14px;
  border: 1px solid #e0dcd8;
  border-radius: 8px;
  background: white;
  font-size: 0.95rem;
  font-weight: 300;
  color: #3d3d3d;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  transition: border-color 0.2s ease;
}

.piano-select:hover {
  border-color: #B8956D;
}

.piano-select:focus {
  outline: none;
  border-color: #B8956D;
}

/* Note Selection */
.note-squares {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.note-square {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.note-square.enabled {
  background: #B8956D;
  color: white;
}

.note-square.disabled {
  background: #e0dcd8;
  color: #888;
}

.note-square.cannot-disable {
  cursor: not-allowed;
}

@media (hover: hover) and (pointer: fine) {
  .note-square:hover:not(.cannot-disable) {
    transform: scale(1.08);
  }
}

@media (max-width: 500px) {
  .note-squares {
    gap: 4px;
  }

  .note-square {
    width: 32px;
    height: 32px;
    font-size: 0.7rem;
  }
}
</style>
