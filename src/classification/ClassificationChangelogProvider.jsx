import {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {useSearchParams} from 'react-router-dom'
import APIContext from '../app/APIContext.jsx'
import ClassificationContext from '../app/ClassificationContext.jsx'

export default function ClassificationChangelogProvider({children}) {
    const parent = useContext(ClassificationContext)
    const {fetchClassificationStaged, fetchClassificationPublications,
        fetchClassificationPublication} = useContext(APIContext)
    const [searchParams] = useSearchParams()
    const publicationId = searchParams.get('id')
    const [stagedActions, setStagedActions] = useState([])
    const [publications, setPublications] = useState([])
    const [selectedPublication, setSelectedPublication] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [detailLoading, setDetailLoading] = useState(false)
    const [detailError, setDetailError] = useState(null)

    useEffect(() => {
        let active = true
        async function load() {
            try {
                const staged = await fetchClassificationStaged()
                let cursor = null
                let history = []
                do {
                    const page = await fetchClassificationPublications(cursor)
                    history = history.concat(page.publications)
                    cursor = page.nextCursor
                } while (cursor && active)
                if (active) {
                    setStagedActions(staged.actions)
                    setPublications(history)
                    setLoading(false)
                }
            } catch (cause) {
                if (active) {
                    setError(cause)
                    setLoading(false)
                }
            }
        }
        load()
        return () => { active = false }
    }, [fetchClassificationStaged, fetchClassificationPublications])

    useEffect(() => {
        if (!publicationId) return
        let active = true
        setSelectedPublication(null)
        setDetailLoading(true)
        setDetailError(null)
        fetchClassificationPublication(publicationId).then(publication => {
            if (active) {
                setSelectedPublication(publication)
                setDetailLoading(false)
            }
        }).catch(cause => {
            if (active) {
                setDetailError(cause)
                setDetailLoading(false)
            }
        })
        return () => { active = false }
    }, [publicationId, fetchClassificationPublication])

    const stagedByEntry = useMemo(() => new Map(stagedActions.map(action => [action.entryId, action])), [stagedActions])
    const getAdminAction = useCallback(entry => stagedByEntry.get(entry.id) ?? parent.getAdminAction(entry),
        [stagedByEntry, parent])
    const visiblePublications = useMemo(() => selectedPublication &&
        !publications.some(publication => publication.id === selectedPublication.id)
        ? [selectedPublication, ...publications] : publications, [publications, selectedPublication])
    const previousChangelogs = useMemo(() => visiblePublications.map(publication => ({
        ...publication,
        actionCount: publication.actionCount ?? publication.actions?.length ?? 0,
        changes: selectedPublication?.id === publication.id ? selectedPublication.actions : []
    })), [visiblePublications, selectedPublication])
    const value = useMemo(() => ({
        ...parent,
        stagedActions,
        stagedByEntry,
        previousChangelogs,
        selectedPublication,
        changelogLoading: loading || detailLoading,
        changelogError: error || detailError,
        getAdminAction
    }), [parent, stagedActions, stagedByEntry, previousChangelogs, selectedPublication,
        loading, detailLoading, error, detailError, getAdminAction])

    return <ClassificationContext.Provider value={value}>{children}</ClassificationContext.Provider>
}
