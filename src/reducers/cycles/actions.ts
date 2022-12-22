import { Cycle } from './reducer'

export enum ActionTypes {
    ADD_NEW_CYCLE = 'ADD_NEW_CYCLE',
    INTERRUPTED_CURRENT_CYCLE = 'INTERRUPTED_CURRENT_CYCLE',
    MARK_CURRENT_CYCLE_AS_FINISHED = 'MARK_CURRENT_CYCLE_AS_FINISHED',
    SET_ACTIVE_CYCLE_ID_NULL = 'SET_ACTIVE_CYCLE_ID_NULL'
}

export function addNewCycleAction (newCycle: Cycle) {
    return {
        type: ActionTypes.ADD_NEW_CYCLE,
        payload: {
            newCycle
        }
    }
}

export function markCurrentCycleAsFinishedAction () {
    return {
        type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED
    }
}

export function interruptedCurrentCycleAction () {
    return {
        type: ActionTypes.INTERRUPTED_CURRENT_CYCLE
    }
}

export function setActiveCycleIdForContextAction () {
    return {
        type: ActionTypes.SET_ACTIVE_CYCLE_ID_NULL
    }
}