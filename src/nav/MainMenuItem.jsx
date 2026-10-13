import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import queryString from 'query-string'
import React, {useCallback} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {useTheme} from '@mui/material'
import {useAccess} from '../app/AccessContext.jsx'

function MainMenuItem({menuItem, onClose, child, childCount, childIndex}) {
    const {accessInfo} = useAccess()

    const navigate = useNavigate()
    const location = useLocation()
    const theme = useTheme()
    const searchParams = queryString.parse(location.search)
    const {children, title, params, path, icon, admin, allowedRoles} = menuItem

    const isCurrentPath = location.pathname === path
    const isCurrentParams = Object.keys(params || [])
        .every(key => params[key] === searchParams[key])
    const isCurrentRoute = isCurrentPath && isCurrentParams

    const openInNewTab = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer')
    }

    const handleClick = useCallback(() => {
        if (children) {
            return null
        } else if (path.includes('http')) {
            openInNewTab(path)
        } else {
            onClose()
            const url = params
                ? `${path}?${queryString.stringify(params)}`
                : path
            navigate(url)
            window.scrollTo({top: 0})
        }
    }, [children, navigate, onClose, params, path])

    const color = isCurrentRoute
        ? '#18aa18'
        : allowedRoles
            ? theme.roles?.[accessInfo.highestRole] ?? theme.menu?.blueLight
            : 'inherit'

    const adminStyle = allowedRoles?.includes('admin') || admin
        ? {fontStyle: 'italic'}
        : {}

    const finalDiv = childIndex + 1 === childCount
        ? <div style={{height: 10}}/>
        : undefined

    const style = child
        ? {padding: '2px 0px 6px 36px', margin: '0px 15px 1px 28px', color, ...adminStyle}
        : {padding: '10px 30px 10px 20px',color, ...adminStyle}

    const coloredIcon = icon
        ? React.cloneElement(icon, {style: {color}})
        : null

    const numChildren = children ? children.length : 0

    return (
        <React.Fragment>
            <ListItemButton style={style} onClick={handleClick} dense={child}>
                {coloredIcon &&
                    <ListItemIcon style={{height:20}}>
                        {coloredIcon}
                    </ListItemIcon>
                }
                <ListItemText>{title}</ListItemText>
            </ListItemButton>
            {finalDiv}

            {children && children.map((childItem, childIndex) =>
                    <MainMenuItem
                        child
                        key={childIndex}
                        menuItem={childItem}
                        onClose={onClose}
                        style={style}
                        childCount={numChildren}
                        childIndex={childIndex}
                        allowedRoles={allowedRoles}
                    />
            )}
        </React.Fragment>
    )
}

export default MainMenuItem
