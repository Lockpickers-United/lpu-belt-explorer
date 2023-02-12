import Typography from '@mui/material/Typography'
import React from 'react'

function FieldValue({name, value}) {
    const style = {marginBottom: 8}
    return (
        <div style={style}>
            <Typography component='span' sx={{color: 'text.secondary'}}>{name}: </Typography>
            <br/>
            <Typography component='span'>{value}</Typography>
        </div>
    )
}

export default React.memo(FieldValue)
