import React, {useCallback, useContext} from 'react'
import useWindowSize from '../util/useWindowSize.jsx'
import DataContext from '../context/DataContext.jsx'
import Link from '@mui/material/Link'
import FilterContext from '../context/FilterContext.jsx'
import {useNavigate} from 'react-router-dom'

export default function SearchDidYouMeanBar() {

    const {anyMatch, closestMake, visibleEntries} = useContext(DataContext)
    const {filters} = useContext(FilterContext)
    const {search} = filters
    const navigate = useNavigate()

    const handleClick = useCallback(() => {
        closestMake && navigate(`/locks?tab=search&search=${encodeURIComponent(closestMake?.make)}`)
    }, [closestMake, navigate])

    const linkSx = {
        color: '#fff', textDecoration: 'underline', cursor: 'pointer', fontStyle: 'italic',
        '&:hover': {
            textDecoration: 'underline'
        }
    }

    const {isMobile} = useWindowSize()
    const style = isMobile
        ? {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: 8}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: 12}

    return (
        <React.Fragment>
            {(visibleEntries?.length === 0 && search && anyMatch && closestMake) &&
                <div style={{
                    ...style,
                    display: 'flex',
                    fontSize: '1.2rem',
                    backgroundColor: '#222',
                    padding: 24,
                    marginTop: 5,
                    alignItems: 'center'
                }}>
                    <div style={{display: 'flex', flexGrow: 1, marginLeft: 8, fontWeight: 500}}>
                        Did you mean&nbsp;
                        <Link onClick={() => handleClick()} sx={linkSx}
                              style={{marginRight: 10}}>{closestMake?.make}</Link>?
                    </div>
                    <div style={{display: 'flex', marginLeft: 8, alignItems: 'center'}}>
                    </div>
                </div>
            }

        </React.Fragment>
    )
}
