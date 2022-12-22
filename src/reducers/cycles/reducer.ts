import { produce } from 'immer';
import { ActionTypes } from "./actions";

export interface Cycle {
    id: string,
    task: string,
    minutesAmount: number,
    startDate: Date,
    interruptedDate?: Date,
    finishedDate?: Date
}

interface CyclesState {
    cycles: Cycle[],
    activeCycleId: string | null
}

export function cyclesReducer(state: CyclesState, action: any) {
    switch(action.tipe) {
        case ActionTypes.ADD_NEW_CYCLE:
            return produce(state, (draft => {
                draft.cycles.push(action.payload.newCycle)
                draft.activeCycleId = action.payload.newCycle.id
            }))
        case ActionTypes.INTERRUPTED_CURRENT_CYCLE: {
            const currentCycleId = state.cycles.findIndex(cycle => {
                return cycle.id === state.activeCycleId
            })
            
            if(currentCycleId < 0){
                return state
            }

            return produce(state, (draft => {
                draft.activeCycleId = null
                draft.cycles[currentCycleId].interruptedDate = new Date()
            }))
        }
        case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
            const currentCycleId = state.cycles.findIndex(cycle => {
                return cycle.id === state.activeCycleId
            })
            
            if(currentCycleId < 0){
                return state
            }

            return produce(state, (draft => {
                draft.activeCycleId = null
                draft.cycles[currentCycleId].finishedDate = new Date()
            }))
        }
        case ActionTypes.SET_ACTIVE_CYCLE_ID_NULL:
            return {
                ...state,
                activeCycleId: null
            };
        default:
            return state;
    }
}