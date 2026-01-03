import { MusyngKitePiano } from './MusyngKitePiano'
import { SalamanderPiano } from './SalamanderPiano'

const STORAGE_KEY = 'ear-tuner-selected-piano'
const DEFAULT_PIANO_ID = 'musyng'

// Registry of all available piano types
export const PIANO_TYPES = {
  [MusyngKitePiano.id]: MusyngKitePiano,
  [SalamanderPiano.id]: SalamanderPiano,
}

// Get list of piano types for UI dropdown
export function getPianoTypeList() {
  return Object.values(PIANO_TYPES).map(PianoClass => ({
    id: PianoClass.id,
    displayName: PianoClass.displayName,
  }))
}

// Get the currently selected piano ID from localStorage
export function getSelectedPianoId() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && PIANO_TYPES[saved]) {
      return saved
    }
  } catch (e) {
    // localStorage not available
  }
  return DEFAULT_PIANO_ID
}

// Save the selected piano ID to localStorage
export function setSelectedPianoId(pianoId) {
  try {
    localStorage.setItem(STORAGE_KEY, pianoId)
  } catch (e) {
    // localStorage not available
  }
}

// Factory function to create a piano instance
export function createPiano(config, pianoId = null) {
  const selectedId = pianoId || getSelectedPianoId()
  const PianoClass = PIANO_TYPES[selectedId]

  if (!PianoClass) {
    console.warn(`Unknown piano type: ${selectedId}, falling back to ${DEFAULT_PIANO_ID}`)
    return new MusyngKitePiano(config)
  }

  return new PianoClass(config)
}
