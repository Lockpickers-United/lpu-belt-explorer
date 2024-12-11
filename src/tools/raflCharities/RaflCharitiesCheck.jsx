import React from 'react'
import useData from '../../util/useData.jsx'
import LoadingDisplay from '../../misc/LoadingDisplay.jsx'

function ContentSubmit() {

    const {data, loading, error} = useData({urls})

    const formOnly = data?.formCharities.reduce((acc, charity) => {
        const siteCharity = data?.siteCharities.find(c => c.name === charity.value)
        if (!siteCharity) acc.push(charity)
        return acc
    }, []).filter(x => x)

    const siteOnly = data?.siteCharities.reduce((acc, charity) => {
        const formCharity = data?.formCharities.find(c => c.value === charity.name)
        if (!formCharity) acc.push(charity)
        return acc
    }, []).filter(x => x)

    return (
        <div style={{
            maxWidth: 700, padding: 0,
            marginLeft: 'auto', marginRight: 'auto', marginTop: 16, marginBottom: 46
        }}>
            <div style={{}}>
                <div style={{fontSize: '1.4rem', fontWeight: 700, marginBottom: 30}}>Comparing charities on site vs.
                    Google form
                </div>

                {(loading || error) &&
                    <LoadingDisplay/>
                }

                {!loading && siteOnly.length === 0 && formOnly.length === 0 &&
                    <div style={{
                        backgroundColor: '#37ae47',
                        padding: '20px 20px',
                        fontSize: '1.3rem',
                        fontWeight: 700,
                        textAlign: 'center'
                    }}>
                        Charity lists are identical
                    </div>
                }

                    {!loading && (siteOnly.length > 0 || formOnly.length > 0) &&
                    <div style={{
                        backgroundColor: '#ae3737',
                        padding: '20px 20px',
                        fontSize: '1.1rem'
                    }}>
                        <strong>Charities in form but not on site:</strong>
                        <ul style={{marginBottom: 30}}>
                            {formOnly?.map((charity, index) =>
                                <li key={index}>{charity.value}</li>
                            )}
                        </ul>

                        <strong>Charities on site but not in form:</strong>
                        <ul>
                            {siteOnly?.map((charity, index) =>
                                <li key={index}>{charity.name}</li>
                            )}
                        </ul>
                    </div>
                }
            </div>
        </div>
    )
}

const urls = {
    formCharities: 'https://explore.lpubelts.com:8443/rafl-charities',
    siteCharities: 'https://lpubelts.com/raflCharities.json'
}

export default ContentSubmit

