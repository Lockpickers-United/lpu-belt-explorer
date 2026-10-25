import React, {useCallback} from 'react'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import useWindowSize from '../util/useWindowSize.jsx'
import {useNavigate} from 'react-router-dom'

function SubNav({options, defaultValue, onNavChange=() => {}}) {

    const navigate = useNavigate()
    const handleButtonClick = useCallback(newValue => {
        onNavChange()
        navigate(newValue?.page)
    }, [onNavChange, navigate])

    const {isMobile} = useWindowSize()
    const fontOptions = isMobile ? {fontSize: '0.95rem', lineHeight:'1.1rem'} : {fontSize: '1.0rem', fontWeight: 500}

    return (
        <ToggleButtonGroup
            variant='outlined'
        >
            {options.map(option =>
                <ToggleButton
                    key={option.label}
                    onClick={() => handleButtonClick(option)}
                    style={{
                        color: defaultValue === option.label ? '#eee' : '#aaa',
                        backgroundColor: defaultValue === option.label ? '#292929' : '#111',
                        padding: '6px 12px', borderColor: '#000', borderRadius: 0,
                        ...fontOptions
                    }}
                    value={option.label}
                >{option.label}</ToggleButton>
            )}
        </ToggleButtonGroup>
    )
}

export default SubNav
