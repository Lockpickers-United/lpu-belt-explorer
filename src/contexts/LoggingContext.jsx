import React, {useEffect, useMemo, useState} from 'react'

const LoggingContext = React.createContext({})

export function LoggingProvider({children}) {

    let [logging, setLogging] = useState([])

    setLogging([1]);

    return (
        logging
    )
}

export default LoggingContext
