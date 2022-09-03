import Typography from '@mui/material/Typography'
import React from 'react'

function FieldValue({name, value}) {
    return (
        <div style={{marginBottom: 4}}>
            <Typography component='span' sx={{color: 'text.secondary'}}>{name}: </Typography>
            <Typography component='span'>{value}</Typography>
        </div>
    )
}

export default FieldValue
