import React from 'react'
import {redirect} from 'react-router-dom'
import BeltList from './BeltList'

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
        element: <div>Testing 123</div>
    }
]
