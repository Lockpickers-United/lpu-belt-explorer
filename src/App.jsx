import React, {useState} from 'react'
import Entries from './Entries.jsx'
import Nav from './Nav.jsx'
import {FilterProvider} from './FilterContext.jsx'
import {StorageProvider} from './StorageContext.jsx'
import useWindowSize from './useWindowSize.js'
import Footer from './Footer.jsx'
import data from './data/data.js'
import queryString from 'query-string'

function App() {
    const [tab, setTab] = useState(() => {
        const idFiltered = location.search.startsWith('?id=')
        if (idFiltered && data.length > 0) {
            const query = queryString.parse(location.search)
            const entry = data.find(({id}) => query.id === id)
            if (entry) {
                return entry.belt.replace(/\d/g, '')
            }
        } else if (location.search.length > 0) {
            return 'search'
        }
        return 'white'
    })
    const handleChangeTab = newBelt => setTab(newBelt)
    const {width} = useWindowSize()
    const isMobile = width <= 736

    return (
        <StorageProvider>
            <FilterProvider>
                <Nav
                    isMobile={isMobile}
                    data={data}
                    tab={tab}
                    onChangeTab={handleChangeTab}
                />

                <Entries
                    isMobile={isMobile}
                    tab={tab}
                    data={data}
                    onChangeTab={handleChangeTab}
                />

                <Footer/>
            </FilterProvider>
        </StorageProvider>
    )
}


export default App
