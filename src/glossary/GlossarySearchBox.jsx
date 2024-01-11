import React, {useCallback} from 'react'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import {useNavigate} from 'react-router-dom'
import glossary from '../data/glossary.json'

function GlossarySearchBox() {
    const style = {maxWidth: 450}
    const navigate = useNavigate()

    const handleChange = useCallback((event, value) => {
        if (!value) {
            navigate('/glossary')
        } else if (glossaryTerms.includes(value)) {
            navigate(`/glossary?term=${value}`)
        }
    }, [navigate])

    return (
        <Autocomplete
            selectOnFocus
            clearOnEscape
            handleHomeEndKeys
            fullWidth
            style={style}
            options={glossaryTerms}
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

const glossaryTerms = glossary.map(item => item.term)

export default GlossarySearchBox
