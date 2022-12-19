import { HandPalm, Play } from 'phosphor-react'
import { HomeContainer, StartCountdownButton, StopCountdownButton } from './styles'
import { createContext, useEffect, useState } from 'react'
import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import * as zod from 'zod'

interface Cycle {
    id: string,
    task: string,
    minutesAmount: number,
    startDate: Date,
    interruptedDate?: Date,
    finishedDate?: Date
}

interface CyclesContextType {
    activeCycle: Cycle | undefined,
    activeCycleId: string | null,
    markCurrentCycleAsFinished: () => void,
    setActiveCycleIdForContext: () => void,
    amountSecondsPassed: number,
    setSecondsPassed: (seconds: number) => void
}

export const CyclesContext = createContext({} as CyclesContextType)

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod
        .number()
        .min(5, 'O ciclo precisa ser de no mínimo 5 minutos.')
        .max(60, 'O ciclo precisa ser de no máximo 60 minutos.')
})

// interface NewCycleFormData {
//     task: string,
//     minutesAmount: number
// }

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export function Home () {
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

    function setActiveCycleIdForContext () {
        setActiveCycleId(null);
    }

    function setSecondsPassed (seconds: number) {
        setAmountSecondsPassed(seconds);
    }

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    });

    const { handleSubmit, watch, reset } = newCycleForm;

    function handleCreateNewCycle (data: NewCycleFormData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        setCycle((state) => [...state, newCycle]);
        setActiveCycleId(newCycle.id);
        setSecondsPassed(0);

        reset();
    }

    function handleInterruptedCycle () {
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

    const task = watch('task');
    const isSubmitDisabled = !task;

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                <CyclesContext.Provider 
                    value={{ 
                        activeCycle, 
                        activeCycleId, 
                        markCurrentCycleAsFinished, 
                        setActiveCycleIdForContext,
                        amountSecondsPassed,
                        setSecondsPassed
                    }}
                >
                    <FormProvider {...newCycleForm}>
                        <NewCycleForm />
                    </FormProvider>
                    <Countdown />
                </CyclesContext.Provider>

                {
                    (activeCycle) ? (
                        <StopCountdownButton onClick={handleInterruptedCycle} type="button">
                            <HandPalm size={24} />
                            Interromper
                        </StopCountdownButton>
                    ) : (
                        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                            <Play size={24} />
                            Começar
                        </StartCountdownButton>
                    )
                }
            </form>
        </HomeContainer>
    )
}