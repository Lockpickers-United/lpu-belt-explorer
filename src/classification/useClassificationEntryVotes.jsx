import {useCallback, useContext, useEffect, useState} from 'react'
import APIContext from '../app/APIContext.jsx'

export default function useClassificationEntryVotes(entryId, revision, enabled) {
    const {fetchClassificationEntryVotes} = useContext(APIContext)
    const [result, setResult] = useState({votes: [], loading: false, error: null})
    const [retry, setRetry] = useState(0)

    useEffect(() => {
        if (!enabled || !entryId) return
        let active = true
        setResult({votes: [], loading: true, error: null})
        async function load() {
            try {
                let cursor = null
                let votes = []
                do {
                    const page = await fetchClassificationEntryVotes(entryId, cursor)
                    votes = votes.concat(page.votes)
                    cursor = page.nextCursor
                } while (cursor && active)
                if (active) setResult({votes, loading: false, error: null})
            } catch (error) {
                if (active) setResult({votes: [], loading: false, error})
            }
        }
        load()
        return () => { active = false }
    }, [enabled, entryId, revision, retry, fetchClassificationEntryVotes])

    const reload = useCallback(() => setRetry(value => value + 1), [])
    return {...result, reload}
}
