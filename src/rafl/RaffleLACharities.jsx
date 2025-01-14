import React, {useCallback} from 'react'
import useWindowSize from '../util/useWindowSize.jsx'
import Link from '@mui/material/Link'

export default function RaffleLACharities({charities}) {

    const {isMobile} = useWindowSize()
    const style = isMobile
        ? {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: 8}
        : {maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', padding: 12}

    const borderstyle = charities ? {borderBottom: '1px #555 solid'} : {}

    const openInNewTab = useCallback((url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }, [])

    return (
        <React.Fragment>
            <div style={{...style, backgroundColor: '#333', minHeight: 72, ...borderstyle}}>
                <div style={{display: 'flex', flexGrow: 1, marginLeft: 8, fontWeight:700, fontSize:'1.1rem'}}>
                    Los Angeles Wildfires
                </div>
                <div style={{margin: '12px 20px 0px 8px'}}>
                    In light of the devastating wildfires in Los Angeles,
                    we have added a number of California-based charities to our list of options.
                    These vetted organizations are providing support to victims of the fires,
                    their families, and the first-responders who are battling the blazes.
                </div>
            </div>
            <div style={{padding: '16px 0px 0px 0px', backgroundColor: '#000'}}/>
            {charities && charities.map(charity =>
                <div key={charity.name}
                     style={{margin: '0px 0px 0px 0px', padding: '3px 0px 2px 20px', backgroundColor: '#000'}}>
                    { charity.url
                    ? <Link onClick={() => openInNewTab(charity.url)}
                            style={{color: '#fff', fontWeight: 500}}>{charity.name}</Link>
                    : <span style={{color: '#ddd'}}>{charity.name}</span>
                    }
                </div>
            )}
            <div style={{padding: '24px 0px 0px 0px', backgroundColor: '#000'}}/>
        </React.Fragment>
    )

}