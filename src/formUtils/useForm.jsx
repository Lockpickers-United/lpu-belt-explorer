import {useCallback, useState} from 'react'

export default function useForm({baseForm, processChange, processSubmit, handleSubmit}) {
    const [form, setForm] = useState(baseForm)
    const [intialized, setInitialized] = useState(false)
    const [required, setRequired] = useState([])
    const [invalid, setInvalid] = useState([])
    const [changed, setChanged] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState(undefined)
    const [clearOnSumbit, setClearOnSubmit] = useState(true)

    const canSave =
        intialized
        && changed
        && (required.reduce((acc, field) => acc && form[field], true))
        && !invalid.some(field => required.includes(field))
        && !submitting

    const initialize = useCallback((params) => {
        setRequired(params.requiredFields)
        setClearOnSubmit(params.clearOnSubmit)
        setInitialized(true)
    }, [])

    const require = useCallback((requiredFields) => {
        setRequired(prev => [...new Set([...prev, ...requiredFields])].sort())
    }, [])

    const validate = useCallback((invalidField) => {
        setInvalid(prev => prev.filter(field => field !== invalidField))
    }, [])

    const invalidate = useCallback((invalidField) => {
        setInvalid(prev => [...new Set([...prev, invalidField])])
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
        setRequired([])
        setClearOnSubmit(true)
        setForm(baseForm)
        //setTimeout(() => {window.scrollTo({left: 0, top: 0, behavior: 'smooth'})}, 100)
    }, [baseForm])

    const clearSubmit = useCallback(() => {
        setSubmitted(false)
        setTimeout(() => {
            window.scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth'
            })
        }, 100)
    }, [])

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
        required,
        invalid,
        validate,
        invalidate,
        update,
        changed,
        canSave,
        submit,
        submitting,
        submitted,
        clearOnSumbit,
        clearSubmit,
        reload,
        error
    }
}
