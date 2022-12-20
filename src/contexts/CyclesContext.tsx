import { ReactNode, createContext } from 'react'
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
    cycle: Cycle[],
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
    const [cycle, setCycle] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
    const activeCycle = cycle.find(cycle => cycle.id === activeCycleId);

    function markCurrentCycleAsFinished () {
        setCycle( 
            cycle.map((cylcle) => {
                if(cylcle.id === activeCycleId) {
                    return { ...cylcle, finishedDate: new Date() }
                }else {
                    return cylcle
                }
            })
        )
    }

    function setSecondsPassed (seconds: number) {
        setAmountSecondsPassed(seconds);
    }

    function setActiveCycleIdForContext () {
        setActiveCycleId(null);
    }

    function createNewCycle (data: CreateCycleData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        setCycle((state) => [...state, newCycle]);
        setActiveCycleId(newCycle.id);
        setSecondsPassed(0);

        //reset();
    }

    function interruptedCurrentCycle () {
        setCycle(
            cycle.map((cylcle) => {
                if(cylcle.id === activeCycleId) {
                    return { ...cylcle, interruptedData: new Date() }
                }else {
                    return cylcle
                }
            })
        )

        setActiveCycleId(null);
    }

    return (
        <CyclesContext.Provider
            value={{
                cycle,
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