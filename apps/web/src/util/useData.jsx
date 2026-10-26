import Button from '@mui/material/Button'
import {enqueueSnackbar} from 'notistack'
import React, {useCallback, useEffect, useMemo, useState} from 'react'

function useData({url, urls, loadFn, text}) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const [dataError, setDataError] = useState(null)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false)
    const [status, setStatus] = useState('idle')

    const loadData = useCallback(async () => {
        try {
            setLoading(true)
            setStatus('loading')

            let value
            if (url) {
                const response = await fetch(url, {cache: 'no-store'})
                value = !text ? await response.json() : await response.text()
            } else if (urls) {
                value = {}
                const promises = Object.keys(urls)
                    .map(async key => {
                        const response = await fetch(urls[key], {cache: 'no-store'})
                        value[key] = !text ? await response.json() : await response.text()
                    })
                await Promise.all(promises)
            } else if (loadFn) {
                value = await loadFn()
            }

            setData(value)
            setLoading(false)
            setError(false)
            setStatus(value.error ? 'data-error' : 'success')
            setDataError(value.error)

        } catch (ex) {
            console.error('Error loading data.', ex)
            enqueueSnackbar('Error loading data. Please reload the page.', {
                autoHideDuration: null,
                action: <Button color='secondary' onClick={() => window.location.reload()}>Refresh</Button>
            })
            setLoading(false)
            setError(true)
            setErrorMessage(ex.message)
            setStatus('error')
        }
    }, [url, urls, loadFn, text])

    useEffect(() => {
        loadData().then()
    }, [loadData])

    return useMemo(() => ({
        loading,
        data,
        dataError,
        error,
        errorMessage,
        status,
        refresh: loadData
    }), [loading, data, dataError, error, errorMessage, status, loadData])
}

export default useData
