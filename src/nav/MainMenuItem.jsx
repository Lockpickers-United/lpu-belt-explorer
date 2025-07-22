import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import queryString from 'query-string'
import React, {useCallback} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'

function MainMenuItem({menuItem, onClose, child, childCount, childIndex}) {
    const navigate = useNavigate()
    const location = useLocation()
    const searchParams = queryString.parse(location.search)
    const {children, title, params, path, icon} = menuItem

    const isCurrentPath = location.pathname === path
    const isCurrentParams = Object.keys(params || [])
        .every(key => params[key] === searchParams[key])
    const isCurrentRoute = isCurrentPath && isCurrentParams

    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
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

    const color = isCurrentRoute ? '#18aa18' : null

    const finalDiv = childIndex + 1 === childCount
        ? <div style={{height: 10}}/>
        : undefined

    const style = child
        ? {padding: '5px 0px 9px 48px', margin: '0px 15px 1px 28px', color}
        : {padding: '14px 30px 14px 24px',color}

    const coloredIcon = icon
        ? React.cloneElement(icon, {style: {color}})
        : null

    const numChildren = children ? children.length : 0

    return (
        <React.Fragment>
            <MenuItem style={style} onClick={handleClick} dense={child} >
                {coloredIcon &&
                    <ListItemIcon style={{height:20}}>
                        {coloredIcon}
                    </ListItemIcon>
                }
                <ListItemText>{title}</ListItemText>
            </MenuItem>
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
                    />
            )}
        </React.Fragment>
    )
}

export default MainMenuItem
