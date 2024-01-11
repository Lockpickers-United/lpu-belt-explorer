import React from 'react'
import {createHashRouter, RouterProvider} from 'react-router-dom'
import routes from './routes'

function AppRoutes() {
    const router = createHashRouter(routes)

    return <RouterProvider router={router}/>
}

export default AppRoutes
