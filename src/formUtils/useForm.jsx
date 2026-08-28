import {useCallback, useState} from 'react'

export default function useForm({baseForm, processChange, processSubmit, handleSubmit}) {
    const [form, setForm] = useState(baseForm)
    const [intialized, setInitialized] = useState(false)
    const [required, setRequired] = useState([])
    const [changed, setChanged] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState(undefined)

    const canSave =
        intialized
        && changed
        && (required.reduce((acc, field) => acc && form[field], true))
        && !submitting

    const initialize = useCallback((params) => {
        setRequired(params.requiredFields)
        setInitialized(true)
    }, [])

    const require = useCallback((requiredFields) => {
        setRequired(requiredFields)
    }, [])

    const update = useCallback((event) => {

        const events = processChange ? processChange(event) || event : event

        for (const event of (Array.isArray(events) ? events : [events])) {
            const {name, value, action} = event.target
            //console.log('update', {name, value, action})
            if (action === 'delete') {
                setForm((prevForm) => {
                    const newForm = {...prevForm}
                    delete newForm[name]
                    return newForm
                })
            } else setForm((prevForm) => ({...prevForm, [name]: value}))
        }
        setChanged(true)
    }, [processChange])

    const reload = useCallback(() => {
        setInitialized(false)
        setSubmitted(false)
        setChanged(false)
        setForm(baseForm)
        setTimeout(() => {
            window.scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth'
            })
        }, 100)
    }, [baseForm])

    const submitForm = useCallback(async (form) => {
        console.log('submitting', form)
        try {
            await handleSubmit(form)
            setSubmitted(true)
        } catch (ex) {
            setError(ex)
            console.error('Error submitting form:', ex)
        }
    }, [handleSubmit])

    const submit = useCallback(async () => {
        setSubmitting(true)
        const newForm = processSubmit
            ? processSubmit(form) || form
            : form
        await submitForm(newForm).then(() => setSubmitting(false))
    }, [form, processSubmit, submitForm])

    return {
        initialize,
        intialized,
        form,
        require,
        update,
        changed,
        canSave,
        submit,
        submitting,
        submitted,
        reload,
        error
    }
}
