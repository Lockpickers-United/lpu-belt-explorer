import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Collapse from '@mui/material/Collapse'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import queryString from 'query-string'
import React, {useCallback} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'

function MainMenuItem({menuItem, openTitle, onOpen, onClose, child}) {
    const navigate = useNavigate()
    const location = useLocation()
    const searchParams = queryString.parse(location.search)
    const {children, title, params, path, icon} = menuItem

    const isCurrentPath = location.pathname === path
    const isCurrentParams = Object.keys(params || [])
        .every(key => params[key] === searchParams[key])
    const isCurrentRoute = isCurrentPath && isCurrentParams

    const handleClick = useCallback(() => {
        if (children) {
            const isOpen = openTitle === title
            onOpen(isOpen ? null : title)
        } else {
            onClose()
            const url = params
                ? `${path}?${queryString.stringify(params)}`
                : path
            navigate(url)
            window.scrollTo({top: 0})
        }
    }, [children, navigate, onClose, onOpen, openTitle, params, path, title])

    const color = isCurrentRoute ? '#18aa18' : null

    const style = child
        ? {padding: '10px 0px 10px 48px', margin: '0px 0px 2px 0px', color}
        : {padding: '14px 0px 14px 24px', color}

    const coloredIcon = icon
        ? React.cloneElement(icon, {style: {color}})
        : null

    return (
        <React.Fragment>
            <MenuItem style={style} onClick={handleClick} dense={child}>
                {coloredIcon &&
                    <ListItemIcon style={{height:20}}>
                        {coloredIcon}
                    </ListItemIcon>
                }

                <ListItemText>{title}</ListItemText>

                {children?.length > 0 &&
                    <ListItemIcon>
                        <ExpandMoreIcon
                            style={{
                                margin: '0px 16px',
                                transform: openTitle === title
                                    ? 'rotate(180)'
                                    : null
                            }}
                        />
                    </ListItemIcon>
                }
            </MenuItem>

            {children && children.map((childItem, childIndex) =>
                <Collapse key={childIndex} in={openTitle === title}>
                    <MainMenuItem
                        child
                        menuItem={childItem}
                        openTitle={openTitle}
                        onOpen={onOpen}
                        onClose={onClose}
                    />
                </Collapse>
            )}
        </React.Fragment>
    )
}

export default MainMenuItem
