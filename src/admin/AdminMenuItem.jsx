import React, {useCallback} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import queryString from 'query-string'
import AdminToggleButton from './AdminToggleButton.jsx'

function AdminMenuItem({menuItem}) {

    console.log(menuItem)
    const navigate = useNavigate()
    const location = useLocation()
    const searchParams = queryString.parse(location.search)
    const {title, params, path, icon} = menuItem

    const isCurrentPath = location.pathname === path
    const isCurrentParams = Object.keys(params || [])
        .every(key => params[key] === searchParams[key])
    const isCurrentRoute = isCurrentPath && isCurrentParams

    const handleClick = useCallback(() => {
        const url = params
            ? `${path}?${queryString.stringify(params)}`
            : path
        navigate(url)
        window.scrollTo({top: 0})
    }, [navigate, params, path])

    const color = isCurrentRoute ? '#111' : null

    return (
        <AdminToggleButton
            color={color}
            handleButtonClick={handleClick}
            label={title}
        />
    )
}

export default AdminMenuItem
