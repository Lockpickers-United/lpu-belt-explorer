import queryString from 'query-string'
import React, {useState} from 'react'
import Entries from './Entries.jsx'
import Nav from './Nav.jsx'

function App() {
    const [searchTerm, setSearchTerm] = useState('')
    const query = queryString.parse(location.search)
    const [belt, setBelt] = useState(() => {
        return Object.keys(query).length > 0 ? 'search' : 'white'
    })
    const handleChangeTab = (event, newBelt) => setBelt(newBelt)
    const handleSearch = value => {
        setSearchTerm(value)
        setBelt('search')
    }

    return (
        <React.Fragment>
            <Nav belt={belt} searchTerm={searchTerm} onSearch={handleSearch} onChangeTab={handleChangeTab}/>

            <Entries belt={belt} query={query} searchTerm={searchTerm}/>
        </React.Fragment>
    )
}


export default App
