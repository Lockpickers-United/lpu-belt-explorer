import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import React, {useCallback, useState} from 'react'

function ChoiceButtonGroup({options, onChange, defaultValue}) {
    const [value, setValue] = useState(defaultValue || options[0].label)

    const handleButtonClick = useCallback(newValue => () => {
        const selected = options.find(option => option.label === newValue)
        setValue(newValue)
        onChange && onChange(selected)
    }, [onChange, options])

    return (
        <ToggleButtonGroup
            variant='outlined'
        >
            {options.map(option =>
                <ToggleButton
                    key={option.label}
                    onClick={handleButtonClick(option.label)}
                    style={{
                        color: value === option.label ? '#eee' : '#777',
                        backgroundColor: value === option.label ? '#292929' : '#111',
                        padding: '6px 12px', borderColor: '#000', borderRadius: 0
                    }}
                    value={value}
                >{option.label}</ToggleButton>
            )}
        </ToggleButtonGroup>
    )
}

export default ChoiceButtonGroup
