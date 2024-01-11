import React, {useCallback} from 'react'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import {useNavigate} from 'react-router-dom'

function LeaderboardSearchBox({data}) {
    const style = {maxWidth: 450}
    const navigate = useNavigate()

    const options = data.data
        .filter(item => item.displayName)
        .map(item => item.displayName)

    const handleChange = useCallback((event, value) => {
        if (!value) {
            navigate('/leaderboard')
        } else if (options.includes(value)) {
            navigate(`/leaderboard?user=${value}`)
        }
    }, [navigate, options])

    return (
        <Autocomplete
            selectOnFocus
            clearOnEscape
            handleHomeEndKeys
            fullWidth
            style={style}
            options={options}
            onChange={handleChange}
            renderInput={(params) =>
                <TextField
                    {...params}
                    placeholder='Search'
                    variant='standard'
                    color='secondary'
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <InputAdornment position='start'>
                                <SearchIcon/>
                            </InputAdornment>
                        )
                    }}
                />
            }
        />
    )
}

export default LeaderboardSearchBox
