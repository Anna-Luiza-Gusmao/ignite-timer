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
            return {
                ...state,
                cycles: [...state.cycles, action.payload.newCycle],
                activeCycleId: action.payload.newCycle.id
            };
        case ActionTypes.INTERRUPTED_CURRENT_CYCLE:
            return {
                ...state,
                cycles: state.cycles.map((cylcle) => {
                    if(cylcle.id === state.activeCycleId) {
                        return { ...cylcle, interruptedDate: new Date() }
                    }else {
                        return cylcle
                    }
                }),
                activeCycleId: null
            };
        case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED:
            return {
                ...state,
                cycles: state.cycles.map((cylcle) => {
                    if(cylcle.id === state.activeCycleId) {
                        return { ...cylcle, finishedDate: new Date() }
                    }else {
                        return cylcle
                    }
                }),
                activeCycleId: null
            };
        case ActionTypes.SET_ACTIVE_CYCLE_ID_NULL:
            return {
                ...state,
                activeCycleId: null
            };
        default:
            return state;
    }
}