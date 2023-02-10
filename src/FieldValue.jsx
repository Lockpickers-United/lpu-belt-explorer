import Typography from '@mui/material/Typography'
import React from 'react'

function FieldValue({name, value, centered}) {
    const style = {marginBottom: 8}
    if (centered) {
        style.marginLeft = 'auto'
        style.marginRight = 'auto'
    }
    return (
        <div style={style}>
            <Typography component='span' sx={{color: 'text.secondary'}}>{name}: </Typography>
            <br/>
            <Typography component='span'>{value}</Typography>
        </div>
    )
}

export default FieldValue
