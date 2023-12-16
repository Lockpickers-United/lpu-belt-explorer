import React from 'react'
import {redirect} from 'react-router-dom'
import BeltList from './BeltList'
import TestRoute from './TestRoute'

export default [
    {
        path: '/',
        loader: () => redirect('/belts')
    },
    {
        path: '/belts',
        element: <BeltList/>
    },
    {
        path: '/test',
        element: <TestRoute/>
    }
]
