import React from 'react'
import Typography from '@mui/material/Typography'

function FieldValue({name, value, last, unranked}) {
    const marginStyle = last ? {} : {marginBottom: 8}
    const headerStyle = unranked ? {color: '#777'} : {}
    const textStyle = unranked ? {color: '#AAA'} : {}
    return (
        <div style={marginStyle}>
            <Typography
                component='div'
                variant='subtitle2'
                sx={{color: 'text.disabled'}}
                style={headerStyle}
            >
                {name}:
            </Typography>
            <Typography
                component='div'
                style={textStyle}
            >
                {value}
            </Typography>
        </div>
    )
}

export default React.memo(FieldValue)
