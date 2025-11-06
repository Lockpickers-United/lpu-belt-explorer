import React, {useCallback, useContext, useEffect} from 'react'
import useWindowSize from '../util/useWindowSize.jsx'
import DataContext from '../context/DataContext.jsx'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import {InputLabel} from '@mui/material'
import FormControl from '@mui/material/FormControl'
import Link from '@mui/material/Link'
import entryName from '../entries/entryName'
import AppContext from '../app/AppContext.jsx'

export default function SearchCutoffBar() {

    const {searchCutoff, setSearchCutoff, searchVariant, setSearchVariant, visibleBeltEntries = []} = useContext(DataContext)
    const {admin, qaUser} = useContext(AppContext)

    useEffect(() => {
        // Avoid infinite updates: compare by fields, not by object identity
        const defaultCutoff = {A: '0.40', B: '0.25'}
        const needsReset = !admin && (
            searchCutoff?.A !== defaultCutoff.A || searchCutoff?.B !== defaultCutoff.B
        )
        if (needsReset) {
            setSearchCutoff(defaultCutoff)
        }
    }, [admin, searchCutoff?.A, searchCutoff?.B, setSearchCutoff])

    const [open, setOpen] = React.useState(false)
    const handleClose = useCallback(() => setOpen(false), [])
    const handleOpen = useCallback(() => setOpen(true), [])
    const handleChange = useCallback(event => {
        const newCutoff = {A: '0.30', B: '0.25'}
        newCutoff[searchVariant] = event.target.value
        setSearchCutoff(newCutoff)
    }, [searchVariant, setSearchCutoff])

    const handleChangeVariant = useCallback(variant => {
        setSearchVariant(variant)
    }, [setSearchVariant])

    const logEntries = useCallback(() => {
        console.log('\n> Search Cutoff', searchCutoff)
        visibleBeltEntries.map(entry => {
            const foo = `${entry.score.toFixed(3)} - ${entryName(entry, 'long')} (${entry.belt})`
            console.log(foo)
        })
    }, [searchCutoff, visibleBeltEntries])

    const linkSx = {
        color: '#fff', textDecoration: 'none', cursor: 'pointer', '&:hover': {
            textDecoration: 'underline'
        }
    }

    const {isMobile} = useWindowSize()
    const style = isMobile
        ? {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: 8}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: 12}

    if (!admin && !qaUser) return null
    return (
        <div style={{...style, display: 'flex', backgroundColor: '#333', padding: 8, marginTop: 5, alignItems: 'center'}}>
            <div style={{display: 'flex', flexGrow: 1, marginLeft: 8, fontWeight: 500}}>
                Search Variant
                <Link onClick={() => handleChangeVariant('A')} sx={linkSx} style={{
                    marginLeft: 10,
                    fontWeight: searchVariant === 'A' ? 'bold' : 'normal',
                    textDecoration: searchVariant === 'A' ? 'underline' : 'none'
                }}>A</Link>
                <span style={{marginLeft: 6, marginRight: 6}}>|</span>
                <Link onClick={() => handleChangeVariant('B')} sx={linkSx} style={{
                    fontWeight: searchVariant === 'B' ? 'bold' : 'normal',
                    textDecoration: searchVariant === 'B' ? 'underline' : 'none'
                }}>B</Link>
            </div>
            <div style={{display: 'flex', marginLeft: 8, alignItems: 'center'}}>
                <FormControl id='beltPulldown' size='small' variant='outlined'
                             style={{marginBottom: 0, width: 100, marginRight: 20}}>
                    <InputLabel style={{color: '#bbb'}}>Cutoff Value</InputLabel>
                    <Select
                        name='cutoff-selector'
                        label={'Cutoff Value'}
                        open={open}
                        onClose={handleClose}
                        onOpen={handleOpen}
                        value={searchCutoff[searchVariant]}
                        onChange={handleChange}
                        style={{backgroundColor: '#222', fontSize: '1.1rem', fontWeight: 500}}
                        color='secondary'
                    >
                        {cutoffOptions.map((value, index) =>
                            <MenuItem key={index} value={value}>
                                {value}
                            </MenuItem>
                        )}
                    </Select>
                </FormControl>
                <Link onClick={() => logEntries()} sx={linkSx} style={{marginRight: 10}}>log</Link>
            </div>
        </div>
    )
}


const cutoffOptions = [
    '0.15',
    '0.16',
    '0.17',
    '0.18',
    '0.19',
    '0.20',
    '0.21',
    '0.22',
    '0.23',
    '0.24',
    '0.25',
    '0.26',
    '0.27',
    '0.28',
    '0.29',
    '0.30',
    '0.31',
    '0.32',
    '0.33',
    '0.34',
    '0.35',
    '0.36',
    '0.37',
    '0.38',
    '0.39',
    '0.40',
    '0.41',
    '0.42',
    '0.43',
    '0.44',
    '0.45',
    '0.46',
    '0.47',
    '0.48',
    '0.49',
    '0.50'
]