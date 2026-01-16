import { ActionType } from "./actions";
import { pickBolt, placeBolt } from "../logic/rodLogic";
import { initialGameState } from "./initialGameState";


export function gameReducer(state, action) {
    switch (action.type) {

        case ActionType.IMPORT:
        case ActionType.GENERATE:
            return {
                ...initialGameState,
                rods: action.rods,
                heldBolt: null,
                iteration: 0,
                history: []
            }
        
        case ActionType.PICK_BOLT:
            if (state.heldBolt !== null) return state

            const result = pickBolt(state.rods, action.rodIndex)
            if (!result || result.bolt == null) return state

            return {
                ...state,
                rods: result.nextRods,
                heldBolt: result.bolt
            }

        case ActionType.PLACE_BOLT:
            if (state.heldBolt === null) return state

            const nextRods = placeBolt(state.rods, action.rodIndex, state.heldBolt)

            return {
                ...state,
                rods: nextRods,
                heldBolt: null,
                iteration: state.iteration + 1,
                history: [...state.history, state.rods]
            }

        case ActionType.NEXT_STEP:
            if (!state.rods.length) return state

            const newRods = nextStep(state.rods)

            return {
                ...state,
                rods: newRods,
                iteration: state.iteration + 1,
                history: [...state.history, state.rods]
            }

        case ActionType.UNDO:
            if (!state.history.length) return state

            return {
                ...state,
                rods: state.history.at(-1),
                iteration: Math.max(0, state.iteration - 1),
                history: state.history.slice(0, -1)
            }
        
        default:
            return state
    }
}
