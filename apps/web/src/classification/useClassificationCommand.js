import {useCallback, useContext, useRef, useState} from 'react'
import APIContext from '../app/APIContext.jsx'

export default function useClassificationCommand() {
    const {classificationCommand} = useContext(APIContext)
    const attempt = useRef(null)
    const [pending, setPending] = useState(false)
    const [error, setError] = useState(null)

    const run = useCallback(async (method, path, body) => {
        const signature = JSON.stringify([method, path, body])
        if (attempt.current?.signature !== signature) {
            attempt.current = {signature, key: crypto.randomUUID()}
        }
        setPending(true)
        setError(null)
        try {
            const result = await classificationCommand(method, path, body, attempt.current.key)
            attempt.current = null
            return result
        } catch (cause) {
            setError(cause)
            throw cause
        } finally {
            setPending(false)
        }
    }, [classificationCommand])

    return {run, pending, error, clearError: () => setError(null)}
}
