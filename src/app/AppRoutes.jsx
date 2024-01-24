import React, {useContext} from 'react'
import {createHashRouter, RouterProvider} from 'react-router-dom'
import AppContext from './AppContext'
import routes from './routes'

function AppRoutes() {
    const {beta} = useContext(AppContext)
    const filteredRoutes = routes.filter(route => beta || !route.beta)
    const router = createHashRouter(filteredRoutes)

    return <RouterProvider router={router}/>
}

export default AppRoutes
