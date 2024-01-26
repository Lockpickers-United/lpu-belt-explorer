import React, {useContext} from 'react'
import {createHashRouter, RouterProvider} from 'react-router-dom'
import AppContext from './AppContext'
import routes from './routes'

function AppRoutes() {
    const {admin, beta} = useContext(AppContext)
    const filteredRoutes = routes
        .filter(route => beta || !route.beta)
        .filter(route => admin || !route.admin)
    const router = createHashRouter(filteredRoutes)

    return <RouterProvider router={router}/>
}

export default AppRoutes
