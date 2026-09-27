import Button from '@mui/material/Button'
import {enqueueSnackbar} from 'notistack'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {getData} from '../formUtils/getData.jsx'

export default function useGetRequest({user, url, urls, snackBars=false, enabled=true}) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const [dataError, setDataError] = useState(null)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false)
    const [status, setStatus] = useState('idle')

    const loadData = useCallback(async () => {
        if (enabled) try {
            setLoading(true)
            setStatus('loading')

            let value
            if (url) {
                value = await getData({user, url, snackBars})
            } else if (urls) {
                value = {}
                const promises = Object.keys(urls)
                    .map(async key => {
                        value[key] = await getData({url: urls[key], snackBars})
                    })
                await Promise.all(promises)
            }

            setData(value)
            setLoading(false)
            setError(false)
            setStatus(value.error ? 'data-error' : 'success')
            setDataError(value.error)

        } catch (ex) {
            console.error('Error loading data.', ex)
            if (snackBars) enqueueSnackbar('Error loading data. Please reload the page.', {
                autoHideDuration: null,
                action: <Button color='secondary' onClick={() => window.location.reload()}>Refresh</Button>
            })
            setLoading(false)
            setError(true)
            setErrorMessage(ex.message)
            setStatus('error')
        }
    }, [enabled, url, urls, user, snackBars])

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
