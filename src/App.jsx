import queryString from 'query-string'
import React, {useState} from 'react'
import Entries from './Entries.jsx'
import Nav from './Nav.jsx'

function App() {
    const [searchTerm, setSearchTerm] = useState('')
    const query = queryString.parse(location.search)

    return (
        <React.Fragment>
            <Nav searchTerm={searchTerm} onSearch={setSearchTerm}/>

            <Entries query={query} searchTerm={searchTerm}/>
        </React.Fragment>
    )
}

export default App
