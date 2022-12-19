import { useForm } from 'react-hook-form'
import { HandPalm, Play } from 'phosphor-react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { differenceInSeconds } from 'date-fns'

import { 
    CountdownContainer, 
    FormContainer, 
    HomeContainer, 
    Separator, 
    StartCountdownButton, 
    TaskInput,
    MinutesAmountInput,
    StopCountdownButton
} from './styles'
import { useEffect, useState } from 'react'

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

interface Cycle {
    id: string,
    task: string,
    minutesAmount: number,
    startDate: Date,
    interruptedDate?: Date,
    finishedDate?: Date
}

export function Home () {
    const [cycle, setCycle] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    });

    const activeCycle = cycle.find(cycle => cycle.id === activeCycleId);
    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

    useEffect(() => {
        let interval: number;

        if(activeCycle) {
            interval = setInterval(() => {
                const secondsDifference = differenceInSeconds(
                    new Date, 
                    activeCycle.startDate
                )

                if(secondsDifference >= totalSeconds){
                    setCycle( 
                        cycle.map((cylcle) => {
                            if(cylcle.id === activeCycleId) {
                                return { ...cylcle, finishedDate: new Date() }
                            }else {
                                return cylcle
                            }
                        })
                    )

                    setAmountSecondsPassed(totalSeconds);
                    setActiveCycleId(null);
                    clearInterval(interval);
                }else {
                    setAmountSecondsPassed(secondsDifference);
                }
            }, 1000);
        }

        return () => {
            clearInterval(interval);
        }
    }, [activeCycle, totalSeconds]);

    function handleCreateNewCycle (data: NewCycleFormData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        setCycle((state) => [...state, newCycle]);
        setActiveCycleId(newCycle.id);
        setAmountSecondsPassed(0);

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

    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;
    const minutesAmount = Math.floor(currentSeconds / 60);
    const secondsAmount = currentSeconds % 60;

    const minutes = String(minutesAmount).padStart(2, '0');
    const seconds = String(secondsAmount).padStart(2, '0');

    const task = watch('task');
    const isSubmitDisabled = !task;

    useEffect(() => {
        if(activeCycle) {
            document.title = `${minutes}:${seconds}`;
        }
    }, [minutes, seconds, activeCycle])

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput 
                        id="task" 
                        placeholder='Dê um nome para o seu projeto' 
                        type="text"
                        list="task-suggestions"
                        {...register('task')}
                        disabled={!!activeCycle}
                    />

                    <datalist id="task-suggestions">
                        <option value="Projeto 1"/>
                        <option value="Projeto 2"/>
                    </datalist>

                    <label htmlFor="minutesAmount">durante</label>
                    <MinutesAmountInput 
                        id="minutesAmount" 
                        type="number"
                        placeholder='00'
                        step={5}
                        min={5}
                        max={60}
                        {...register('minutesAmount', { valueAsNumber: true })}
                        disabled={!!activeCycle}
                    />

                    <span>minutos.</span>
                </FormContainer>

                <CountdownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountdownContainer>

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