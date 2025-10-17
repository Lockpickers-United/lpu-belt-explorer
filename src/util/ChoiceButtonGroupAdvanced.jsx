import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import React, {useCallback, useState} from 'react'

function ChoiceButtonGroupAdvanced({options, onChange, defaultValue, rounded, small = false, style={}}) {
    const [value, setValue] = useState(defaultValue || options[0].value)

    const handleButtonClick = useCallback(newValue => () => {
        const selected = options.find(option => option.value === newValue)
        setValue(newValue)
        onChange && onChange(selected)
    }, [onChange, options])

    const buttonStyle = small
        ? {padding: '1px 10px'}
        : {padding: '6px 12px'}

    const buttonRoundingStyle = rounded
        ? null
        : {borderRadius: 0}

    return (
        <ToggleButtonGroup
            variant='outlined'
            style={{...style, borderRadius: rounded ? 4 : 0}}
        >
            {options.map(option =>
                <ToggleButton
                    key={option.value}
                    onClick={handleButtonClick(option.value)}
                    style={{
                        color: value === option.value ? '#eee' : '#777',
                        backgroundColor: value === option.value ? (option.backgroundColor || '#292929') : '#111',
                        borderColor: '#000', ...buttonStyle, ...buttonRoundingStyle
                    }}
                    value={String(value)}
                >{option.label}</ToggleButton>
            )}
        </ToggleButtonGroup>
    )
}

export default ChoiceButtonGroupAdvanced
