import React from 'react'
import {redirect} from 'react-router-dom'

export default [
    {
        path: '/',
        loader: () => redirect('/locks')
    },
    {
        path: '/belts',
        loader: () => redirect('/locks')
    },
    {
        path: '/locks',
        lazy: async () => {
            const {default: LockListRoute} = await import('../locks/LockListRoute')
            return {element: <LockListRoute/>}
        }
    },
    {
        path: '/leaderboard',
        lazy: async () => {
            const {default: LeaderboardRoute} = await import('../leaderboard/LeaderboardRoute')
            return {element: <LeaderboardRoute/>}
        }
    },
    {
        path: '/info',
        lazy: async () => {
            const {default: LeaderboardRoute} = await import('../info/InfoRoute')
            return {element: <LeaderboardRoute/>}
        }
    },
    {
        path: '/stats',
        lazy: async () => {
            const {default: StatsRoute} = await import('../stats/StatsRoute.jsx')
            return {element: <StatsRoute/>}
        }
    },
    {
        path: '/glossary',
        lazy: async () => {
            const {default: GlossaryRoute} = await import('../glossary/GlossaryRoute.jsx')
            return {element: <GlossaryRoute/>}
        }
    },
    {
        path: '/about',
        lazy: async () => {
            const {default: LPUHistoryRoute} = await import('../history/HistoryRoute.jsx')
            return {element: <LPUHistoryRoute/>}
        }
    }
]
