import Backdrop from '@mui/material/Backdrop'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, {useCallback, useRef, useState} from 'react'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import {useNavigate} from 'react-router-dom'
import glossary from '../data/glossary.json'
import useWindowSize from '../util/useWindowSize'

function GlossarySearchBox() {
    const {isMobile} = useWindowSize()
    const navigate = useNavigate()
    const inputEl = useRef()

    const handleChange = useCallback((_event, value) => {
        if (!value) {
            navigate('/glossary')
        } else if (glossaryTerms.includes(value)) {
            navigate(`/glossary?term=${value}`)
        }
    }, [navigate])

    const [open, setOpen] = useState(false)
    const handleClick = useCallback(() => {
        setOpen(true)
        setTimeout(() => {
            inputEl.current.focus()
            inputEl.current.select()
        }, 0)
    }, [])
    const handleBlur = useCallback(() => setOpen(false), [])

    const style = {maxWidth: 450, margin: 8}
    const focusStyle = open && isMobile ? {
        width: 'auto',
        position: 'fixed',
        left: 40,
        right: 0,
        paddingRight: 16,
        maxWidth: 'unset',
        zIndex: 9999999,
        backgroundColor: '#272727'
    } : {}

    return (
        <React.Fragment>
            {!open && isMobile && <Tooltip title='Search' arrow disableFocusListener>
                <IconButton color='inherit' onClick={handleClick}>
                    <SearchIcon/>
                </IconButton>
            </Tooltip>}

            {(open || !isMobile) && <Autocomplete
                selectOnFocus
                clearOnEscape
                handleHomeEndKeys
                fullWidth
                style={{...style, ...focusStyle}}
                options={glossaryTerms}
                onChange={handleChange}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        placeholder='Search Glossary'
                        variant='standard'
                        color='secondary'
                        inputRef={inputEl}
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
            />}

            <Backdrop
                invisible
                open={open && isMobile}
                onClick={handleBlur}
            />
        </React.Fragment>
    )
}

const glossaryTerms = [...new Set(glossary.map(item => item.term))]

export default GlossarySearchBox
