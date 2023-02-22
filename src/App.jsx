import React, {useContext, useState} from 'react'
import Entries from './Entries.jsx'
import Nav from './Nav.jsx'
import useWindowSize from './useWindowSize.js'
import Footer from './Footer.jsx'
import queryString from 'query-string'
import DataContext from './DataContext.jsx'

function App() {
    const {allEntries: data} = useContext(DataContext)

    const query = queryString.parse(location.search)
    const [tab, setTab] = useState(() => {
        const idFiltered = !!query.id
        if (idFiltered && data.length > 0) {
            const entry = data.find(({id}) => query.id === id)
            if (entry) {
                return entry.belt.replace(/\d/g, '')
            }
        } else if (location.search.length > 0) {
            return 'search'
        }
        return 'white'
    })

    const [expanded, setExpanded] = useState(query.id)
    const handleChangeTab = newBelt => {
        setTab(newBelt)
        setExpanded(undefined)
    }

    const {width} = useWindowSize()
    const isMobile = width <= 736

    return (
        <React.Fragment>
            <Nav
                isMobile={isMobile}
                tab={tab}
                onChangeTab={handleChangeTab}
            />

            <Entries
                isMobile={isMobile}
                tab={tab}
                expanded={expanded}
                onChangeTab={handleChangeTab}
                onExpand={setExpanded}
            />

            <Footer/>
        </React.Fragment>
    )
}


export default App
