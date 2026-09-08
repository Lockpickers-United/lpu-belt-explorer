import Button from '@mui/material/Button'
import {enqueueSnackbar} from 'notistack'
import React from 'react'

const refreshAction = React.createElement(
    Button,
    {
        color: 'secondary',
        onClick: () => window.location.reload()
    },
    'Refresh'
)

async function getDataNoHook({url, urls, loadFn, text}) {
    try {
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

        return value

    } catch (ex) {
        console.error('Error loading data.', ex)
        enqueueSnackbar('Error loading data. Please reload the page.', {
            autoHideDuration: null,
            action: refreshAction
        })
        throw ex
    }
}

export default getDataNoHook
