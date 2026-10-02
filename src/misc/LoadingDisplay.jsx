import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import {circularProgressClasses} from '@mui/material'

function LoadingDisplay({message = undefined, size = 60, thickness = 4, style = {}}) {
    return (
        <React.Fragment>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                placeItems: 'center',
                width: '100%',
                alignItems: 'center',
                height: 200,
                marginRight: 'auto',
                marginLeft: 'auto',
                ...style
            }}>
                <div style={{
                    marginRight: 'auto',
                    marginLeft: 'auto'
                }}>
                    <Box sx={{position: 'relative'}}>
                        <CircularProgress
                            variant='determinate'
                            sx={{
                                color: (theme) =>
                                    theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
                            }}
                            size={size}
                            thickness={thickness}
                            value={100}
                        />
                        <CircularProgress
                            variant='indeterminate'
                            disableShrink
                            sx={{
                                color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
                                animationDuration: '550ms',
                                position: 'absolute',
                                left: 0,
                                [`& .${circularProgressClasses.circle}`]: {
                                    strokeLinecap: 'round'
                                }
                            }}
                            size={size}
                            thickness={thickness}
                        />
                    </Box>
                </div>
                {message &&
                    <div style={{marginTop: 16}}>{message}</div>
                }
            </div>
        </React.Fragment>
    )
}

export default LoadingDisplay
