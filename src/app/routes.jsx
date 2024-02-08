import React from 'react'
import {redirect} from 'react-router-dom'
import ErrorBoundary from './ErrorBoundary'

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
        path: '/dans',
        lazy: async () => {
            const {default: DansRoute} = await import('../info/DansRoute')
            return {element: <DansRoute/>}
        }
    },
    {
        path: '/stats',
        lazy: async () => {
            const {default: StatsRoute} = await import('../stats/StatsRoute')
            return {
                element: <StatsRoute/>
            }
        }
    },
    {
        path: '/glossary',
        lazy: async () => {
            const {default: GlossaryRoute} = await import('../glossary/GlossaryRoute')
            return {element: <GlossaryRoute/>}
        }
    },
    {
        path: '/about',
        lazy: async () => {
            const {default: AboutRoute} = await import('../about/AboutRoute')
            return {element: <AboutRoute/>}
        }
    },
    {
        path: '/privacy',
        lazy: async () => {
            const {default: PrivacyRoute} = await import('../privacy/PrivacyRoute')
            return {element: <PrivacyRoute/>}
        }
    },
    {
        admin: true,
        path: '/admin',
        lazy: async () => {
            const {default: AdminRoute} = await import('../admin/AdminRoute')
            return {element: <AdminRoute/>}
        },
        children: [
            {
                path: '/admin/collectionsReport',
                lazy: async () => {
                    const {default: CollectionsReportMain} = await import('../admin/CollectionsReportMain')
                    return {element: <CollectionsReportMain/>}
                }
            }, {
                path: '/admin/siteReport',
                lazy: async () => {
                    const {default: SiteReportMain} = await import('../admin/SiteReportMain')
                    return {element: <SiteReportMain/>}
                }
            }
        ]
    },
    {
        path: '/profile/edit',
        lazy: async () => {
            const {default: EditProfileRoute} = await import('../profile/EditProfileRoute')
            return {element: <EditProfileRoute/>}
        }
    },
    {
        path: '/profile/:userId',
        lazy: async () => {
            const {default: ProfileRoute} = await import('../profile/ProfileRoute')
            return {element: <ProfileRoute/>}
        }
    },
    {
        beta: true,
        path: '/dials',
        lazy: async () => {
            const {default: DialsRoute} = await import('../dials/DialsRoute')
            return {element: <DialsRoute/>}
        }
    },
    {
        path: '*',
        loader: () => redirect('/locks')
    },
].map(route => ({...route, errorElement: <ErrorBoundary/>}))

