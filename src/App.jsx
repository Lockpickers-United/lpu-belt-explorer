import React, {useEffect, useState} from 'react'
import Entries from './Entries.jsx'
import Nav from './Nav.jsx'
import {FilterProvider} from './FilterContext.jsx'
import {StorageProvider} from './StorageContext.jsx'
import useWindowSize from './useWindowSize.js'
import Footer from './Footer.jsx'

function App() {
    const [tab, setTab] = useState(() => {
        return location.search.length > 0 ? 'search' : 'white'
    })
    const handleChangeTab = newBelt => setTab(newBelt)
    const {width} = useWindowSize()
    const isMobile = width <= 736

    const [data, setData] = useState([])
    useEffect(() => {
        if (!data.length) {
            const loadData = async () => {
                const {default: value} = (await import('./data/data.js'))
                setData(value)
            }
            loadData()
        }
    }, [data])

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
