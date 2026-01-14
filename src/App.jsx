import { useState } from 'react'
import './App.css'

import ImportButton from './components/ImportButton/ImportButton'
import PlayButton from './components/PlayButton/PlayButton'
import RandomButton from './components/RandomButton/RandomButton'
import SimulateButton from './components/SimulateButton/SimulateButton'
import RodBoard from './components/RodBoard/RodBoard'

/**
 * Application modes.
 * These control:
 * - Which buttons are visible
 * - How rods react to user input
 * - Whether simulation playback is active
 */
const AppMode = {
  IDLE: 'idle',
  PLAY: 'play',
  SIMULATE: 'simulate',
}

/**
 * Mapping from numeric bolt representation (used in logic & algorithms)
 * to visual colors (used only for rendering).
 */
const colorMap = {
  1:  'rgb(230, 0, 0)',
  2:  'rgb(230, 172, 0)',
  3:  'rgb(115, 230, 0)',
  4:  'rgb(0, 230, 57)',
  5:  'rgb(0, 230, 230)',
  6:  'rgb(0, 57, 230)',
  7:  'rgb(115, 0, 230)',
  8:  'rgb(230, 0, 172)',
  9:  'rgb(102, 0, 0)',
  10: 'rgb(102, 77, 0)',
  11: 'rgb(51, 102, 0)',
  12: 'rgb(0, 102, 26)',
  13: 'rgb(0, 102, 102)',
  14: 'rgb(0, 26, 102)',
  15: 'rgb(51, 0, 102)',
  16: 'rgb(102, 0, 77)',
}

/**
 * Initial test data.
 * NOTE: Rods store numbers, not colors.
 */
const initialRods = [
  [], 
  [1, 1], 
  [1, 3, 1, 4, 2, 3], 
  [1, 3, 2, 4, 3, 2], 
  [1, 2, 3, 4, 2, 3], 
  [1, 2, 3, 2, 4, 1]
]

function App() {
  /**
   * === CORE STATE ===
   * rods: source of truth for the puzzle state (numeric)
   * mode: current application mode
   */
  const [rods, setRods] = useState(initialRods)
  const [mode, setMode] = useState(AppMode.IDLE)

  /**
   * === PLAY MODE STATE ===
   * heldBolt:
   * - null → nothing held
   * - number → color index of bolt currently attached to cursor
   *
   * Play-mode logic should:
   * - remove top bolt on click if none is held
   * - place held bolt on clicked rod if one is held
   */
  const [heldBolt, setHeldBolt] = useState(null)

  /**
   * === SIMULATION MODE STATE ===
   * step:
   * - index into the simulation move list
   *
   * Future simulation state may also include:
   * - precomputed moves
   * - derived rods for current step
   */
  const [step, setStep] = useState(0)

  /**
   * === DERIVED STATE (RENDER ONLY) ===
   * Converts numeric rods into color rods.
   * DO NOT use this for logic or algorithms.
   */
  const displayRods = rods.map(rod => 
    rod.map(colorIndex => colorMap[colorIndex] || 'white')
  )

  /**
   * === DATA INGESTION ===
   * Import / Random always reset mode back to IDLE.
   */
  const handleImport = (newRods) => {
    setRods(newRods)
    setMode(AppMode.IDLE)
  }

  const handleRandom = (newRods) => {
    setRods(newRods)
    setMode(AppMode.IDLE)
  }

  /**
   * === ROD INTERACTION ENTRY POINT ===
   * This is the ONLY place where rod clicks enter the system.
   *
   * Team members implementing Play mode should:
   * - inspect mode === PLAY
   * - update rods + heldBolt accordingly
   *
   * Simulation mode should ignore rod clicks.
   */
  const handleRodClick = (rodIndex) => {
    if (mode === AppMode.PLAY) {
      // TODO (PLAY MODE):
      // 1. If no bolt is held:
      //    - Remove top bolt from rods[rodIndex]
      //    - Store it in heldBolt
      //
      // 2. If a bolt IS held:
      //    - Place heldBolt on rods[rodIndex]
      //    - Clear heldBolt
    }

    if (mode === AppMode.SIMULATE) {
      // Simulation ignores direct interaction
    }
  }

  /**
   * === MODE TRANSITIONS ===
   */
  const startPlay = () => {
    setHeldBolt(null)
    setMode(AppMode.PLAY)
  }

  const startSimulate = () => {
    setStep(0)
    setMode(AppMode.SIMULATE)
  }

  const stop = () => {
    setHeldBolt(null)
    setMode(AppMode.IDLE)
  }

  /**
   * === CONTROL BAR RENDERING ===
   * Button layout is controlled entirely by mode.
   *
   * Simulation controls will later be wired to:
   * - step--
   * - step++
   * - recompute rods for the current step
   */
  const renderControls = () => {
    switch (mode) {
      case AppMode.IDLE:
        return (
          <>
            <ImportButton onImport={handleImport} />
            <RandomButton onCreate={handleRandom} />
            <PlayButton onPlay={startPlay} />
            <SimulateButton onSimulate={startSimulate} />
          </>
        )
      case AppMode.PLAY:
        return (
          <>
            <button onClick={stop}>Stop</button>
          </>
        )
      case AppMode.SIMULATE:
        return (
          <>
            <button onClick={stop}>Stop</button>

            {/* TODO (SIMULATION):
                Wire to step - 1 (with bounds check) */}
            <button disabled>Previous Step</button>

            <span className='step-counter'>Step {step}</span>

            {/* TODO (SIMULATION):
                Wire to step + 1 (with bounds check) */}
            <button disabled>Next Step</button>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className='app'>
      <h1>Bolt Sorting Simulator</h1>

      <div className='buttons'>
        {renderControls()}
      </div>

      {/* 
        RodBoard is a PURE VIEW component.
        All interaction logic flows through handleRodClick.
      */}
      <RodBoard rods={displayRods} mode={mode} onRodClick={handleRodClick} />
    </div>
  )
}

export default App
