import React from 'react'
import {redirect} from 'react-router-dom'
import BeltList from './BeltList'
import LeaderboardRoute from './LeaderboardRoute.jsx'

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
        path: '/leaderboard',
        element: <LeaderboardRoute/>
    }
]
