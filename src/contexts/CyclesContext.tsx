import { ReactNode, createContext, useReducer } from 'react'
import { useState } from 'react'

interface CreateCycleData {
    task: string,
    minutesAmount: number
}

interface Cycle {
    id: string,
    task: string,
    minutesAmount: number,
    startDate: Date,
    interruptedDate?: Date,
    finishedDate?: Date
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

interface CyclesState {
    cycles: Cycle[],
    activeCycleId: string | null
}

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
    const [cyclesState, dispatch] = useReducer((state: CyclesState, action: any) => {
        switch(action.tipe) {
            case 'ADD_NEW_CYCLE':
                return {
                    ...state,
                    cycles: [...state.cycles, action.payload.newCycle],
                    activeCycleId: action.payload.newCycle.id
                };
            case 'INTERRUPTED_CURRENT_CYCLE':
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
            case 'MARK_CURRENT_CYCLE_AS_FINISHED':
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
            case 'SET_ACTIVE_CYCLE_ID_NULL':
                return {
                    ...state,
                    activeCycleId: null
                };
            default:
                return state;
        }
    }, {
        cycles: [],
        activeCycleId: null
    })

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
    const { cycles, activeCycleId } = cyclesState;
    
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    function markCurrentCycleAsFinished () {
        // setCycle( 
        //     cycle.map((cylcle) => {
        //         if(cylcle.id === activeCycleId) {
        //             return { ...cylcle, finishedDate: new Date() }
        //         }else {
        //             return cylcle
        //         }
        //     })
        // )
        dispatch({
            type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
            payload: {
                activeCycleId
            }
        })
    }

    function setSecondsPassed (seconds: number) {
        setAmountSecondsPassed(seconds);
    }

    function setActiveCycleIdForContext () {
        dispatch({
            type: 'SET_ACTIVE_CYCLE_ID_NULL',
            payload: {
                activeCycleId
            }
        })
    }

    function createNewCycle (data: CreateCycleData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        dispatch({
            type: 'ADD_NEW_CYCLE',
            payload: {
                newCycle
            }
        })
        // setCycle((state) => [...state, newCycle]);
        setSecondsPassed(0);

        //reset();
    }

    function interruptedCurrentCycle () {
        dispatch({
            type: 'INTERRUPTED_CURRENT_CYCLE',
            payload: {
                activeCycleId
            }
        })
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