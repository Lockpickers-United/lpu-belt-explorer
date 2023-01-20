import Typography from '@mui/material/Typography'
import React from 'react'

function FieldValue({name, value}) {
    return (
        <div style={{marginBottom: 8}}>
            <Typography component='span' sx={{color: 'text.secondary'}}>{name}: </Typography>
            <br/>
            <Typography component='span'>{value}</Typography>
        </div>
    )
}

export default FieldValue
