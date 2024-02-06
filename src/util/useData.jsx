import Button from '@mui/material/Button'
import {enqueueSnackbar} from 'notistack'
import React, {useCallback, useEffect, useMemo, useState} from 'react'

function useData({url, urls, loadFn, noCache}) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const [error, setError] = useState(false)

    const loadData = useCallback(async () => {
        try {
            let value
            if (url) {
                const options = noCache ? {cache: 'no-store'} : {}
                const response = await fetch(url, options)
                value = await response.json()
            } else if (urls) {
                value = {}
                const promises = Object.keys(urls)
                    .map(async key => {
                        const options = noCache ? {cache: 'no-store'} : {}
                        const response = await fetch(urls[key], options)
                        value[key] = await response.json()
                    })
                await Promise.all(promises)
            } else if (loadFn) {
                value = await loadFn()
            }

            setData(value)
            setLoading(false)
            setError(false)
        } catch (ex) {
            console.error('Error loading data.', ex)
            enqueueSnackbar('Error loading data. Please reload the page.', {
                autoHideDuration: null,
                action: <Button color='secondary' onClick={() => window.location.reload()}>Refresh</Button>
            })
            setLoading(false)
            setError(true)
        }
    }, [url, urls, loadFn, noCache])

    useEffect(() => {
        loadData()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return useMemo(() => ({
        loading,
        data,
        error,
        refresh: loadData
    }), [data, error, loadData, loading])
}

export default useData
