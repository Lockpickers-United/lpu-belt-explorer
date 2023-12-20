import React from 'react'
import {redirect} from 'react-router-dom'

export default [
    {
        path: '/',
        loader: () => redirect('/belts')
    },
    {
        path: '/belts',
        lazy: async () => {
            const {default: BeltListRoute} = await import('../belts/BeltListRoute')
            return {element: <BeltListRoute/>}
        }
    },
    {
        path: '/leaderboard',
        lazy: async () => {
            const {default: LeaderboardRoute} = await import('../leaderboard/LeaderboardRoute.jsx')
            return {element: <LeaderboardRoute/>}
        }
    },
    {
        path: '/info',
        lazy: async () => {
            const {default: LeaderboardRoute} = await import('../info/InfoRoute.jsx')
            return {element: <LeaderboardRoute/>}
        }
    }
]
