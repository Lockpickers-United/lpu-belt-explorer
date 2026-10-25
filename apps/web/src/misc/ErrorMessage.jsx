import React from 'react'

export default function ErrorMessage({errorMessage}) {
    return (
        <div style={{
            maxWidth: 700, padding: 40, backgroundColor: '#000',
            marginLeft: 'auto', marginRight: 'auto', marginTop: 16,
            justifyContent: 'center', textAlign: 'center'
        }}>
            <div style={{fontSize:'1.3rem', fontWeight:700, marginBottom: 16}}>Oh no!</div>
            <div style={{}}>
                <strong>Something went wrong.</strong><br/>
                Maybe the servers are just tired.<br/>
                More likely, we&#39;re working to fix it.<br/><br/>

                Please try again in a little bit.
            </div>

            {errorMessage && <div style={{fontSize:'0.75rem', padding: 40, color:'#999'}}>{errorMessage}</div>}
        </div>
    )
}