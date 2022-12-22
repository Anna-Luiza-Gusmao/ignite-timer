import { ReactNode, createContext, useReducer } from 'react'
import { useState } from 'react'
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'
import { interruptedCurrentCycleAction, setActiveCycleIdForContextAction } from '../reducers/cycles/actions'
import { addNewCycleAction, markCurrentCycleAsFinishedAction } from '../reducers/cycles/actions'

interface CreateCycleData {
    task: string,
    minutesAmount: number
}

interface CyclesContextType {
    cycles: Cycle[],
    activeCycle: Cycle | undefined,
    activeCycleId: string | null,
    markCurrentCycleAsFinished: () => void,
    setActiveCycleIdForContext: () => void,
    amountSecondsPassed: number,
    setSecondsPassed: (seconds: number) => void,
    createNewCycle: (data: CreateCycleData) => void,
    interruptedCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
    children:  ReactNode;
}

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
    const [cyclesState, dispatch] = useReducer
        (cyclesReducer, {
            cycles: [],
            activeCycleId: null
        })

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
    const { cycles, activeCycleId } = cyclesState;
    
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    function markCurrentCycleAsFinished () {
        dispatch(markCurrentCycleAsFinishedAction());
    }

    function setSecondsPassed (seconds: number) {
        setAmountSecondsPassed(seconds);
    }

    function setActiveCycleIdForContext () {
        dispatch(setActiveCycleIdForContextAction());
    }

    function createNewCycle (data: CreateCycleData) {
        const id = String(new Date().getTime())

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        dispatch(addNewCycleAction(newCycle));
        setAmountSecondsPassed(0);
    }

    function interruptedCurrentCycle () {
        dispatch(interruptedCurrentCycleAction());
    }

    return (
        <CyclesContext.Provider
            value={{
                cycles,
                activeCycle,
                activeCycleId,
                markCurrentCycleAsFinished,
                setActiveCycleIdForContext,
                amountSecondsPassed,
                setSecondsPassed,
                createNewCycle,
                interruptedCurrentCycle
            }}
        >
        {children}
        </CyclesContext.Provider>
    )
}