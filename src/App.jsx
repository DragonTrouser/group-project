import { useReducer } from 'react'
import { gameReducer } from './game/gameReducer'
import { initialGameState } from './game/initialGameState'
import { ActionType } from './game/actions'
import { importBoard } from './logic/importBoard'
import { generateRandomBoard, randomInt } from './logic/randomBoard'

import Controls from './ui/Controls'
import RodBoard from './components/RodBoard/RodBoard'
import { colorMap } from './constants/colorMap'

import './App.css'


export default function App() {
    const [state, dispatch] = useReducer(gameReducer, initialGameState)

    const displayRods = state.rods.map(rod => 
        rod.map(c => colorMap[c])
    )

    const handleRodClick = (rodIndex) => {
        if (state.heldBolt === null) {
            if (!state.rods[rodIndex] || state.rods[rodIndex].length === 0) return
        }

        dispatch({
            type: state.heldBolt === null ? ActionType.PICK_BOLT : ActionType.PLACE_BOLT,
            rodIndex
        })
    }

    return (
        <div className='app'>
            <h1>Bolt Sorting Simulator</h1>

            <Controls
                disabled={state.heldBolt !== null}
                iteration={state.iteration}
                onGenerate={() => {
                    const rodCount = randomInt(5, 15)
                    const rods = generateRandomBoard(rodCount)
                    dispatch({ type: ActionType.GENERATE, rods })
                }}
                onImport={async () => {
                    try {
                        const rods = await importBoard()
                        if (rods) {
                            dispatch({ type: ActionType.IMPORT, rods })
                        }
                    } catch (error) {
                        console.error('Import failed:', error)
                        alert('Failed to import board: ' + error.message)
                    }
                }}
                onNextStep={() => {
                    dispatch({ type: ActionType.NEXT_STEP })
                }}
                onUndo={() => {
                    dispatch({ type: ActionType.UNDO })
                }}
            />

            <RodBoard
                rods={displayRods}
                onRodClick={handleRodClick}
            />
        </div>
    )
}
