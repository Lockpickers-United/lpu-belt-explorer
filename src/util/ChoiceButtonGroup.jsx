import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import React, {useCallback, useState} from 'react'

function ChoiceButtonGroup({options, onChange, defaultValue, small = false, style={}}) {
    const [value, setValue] = useState(defaultValue || options[0].label)

    const handleButtonClick = useCallback(newValue => () => {
        const selected = options.find(option => option.label === newValue)
        setValue(newValue)
        onChange && onChange(selected)
    }, [onChange, options])


    const buttonStyle = small
        ? {padding: '1px 10px', borderRadius: 2}
        : {padding: '6px 12px', borderRadius: 0}

    return (
        <ToggleButtonGroup
            variant='outlined'
            style={style}
        >
            {options.map(option =>
                <ToggleButton
                    key={option.label}
                    onClick={handleButtonClick(option.label)}
                    style={{
                        color: value === option.label ? '#eee' : '#777',
                        backgroundColor: value === option.label ? '#292929' : '#111',
                        borderColor: '#000', ...buttonStyle
                    }}
                    value={value}
                >{option.label}</ToggleButton>
            )}
        </ToggleButtonGroup>
    )
}

export default ChoiceButtonGroup
