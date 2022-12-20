import { FormContainer, TaskInput, MinutesAmountInput } from './styles'
import { CyclesContext } from '../../../../contexts/CyclesContext'
import { useContext } from 'react'
import { useFormContext } from 'react-hook-form';

export function NewCycleForm() {
    const { activeCycle } = useContext(CyclesContext)
    const { register } = useFormContext()

    return (
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
                <option value="Projeto 1" />
                <option value="Projeto 2" />
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
    )
}