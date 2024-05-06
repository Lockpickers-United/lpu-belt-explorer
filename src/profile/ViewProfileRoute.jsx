import {useContext, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import AuthContext from '../app/AuthContext'

function ViewProfileRoute() {
    const {authLoaded, user} = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (authLoaded && user) navigate(`/profile/${user.uid}`)
        else if (authLoaded && !user) navigate('/locks')
    }, [navigate, authLoaded, user])

    return null
}

export default ViewProfileRoute
