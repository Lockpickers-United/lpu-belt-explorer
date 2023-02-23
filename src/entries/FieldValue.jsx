import Typography from '@mui/material/Typography'
import React from 'react'

function FieldValue({name, value, last}) {
    const style = last ? {} : {marginBottom: 8}
    return (
        <div style={style}>
            <Typography
                component='div'
                variant='subtitle2'
                sx={{color: 'text.disabled'}}
            >
                {name}:
            </Typography>
            <Typography component='div'>{value}</Typography>
        </div>
    )
}

export default React.memo(FieldValue)
