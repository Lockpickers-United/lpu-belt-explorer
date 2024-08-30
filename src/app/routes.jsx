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
        path: '/scorecard/info',
        lazy: async () => {
            const {default: ScorecardInfoRoute} = await import('../scorecard/ScorecardInfoRoute.jsx')
            return {element: <ScorecardInfoRoute/>}
        },
        children: [
            {
                path: '/scorecard/info/FAQ',
                lazy: async () => {
                    const {default: InfoFaqBB} = await import('../scorecard/InfoFaqBB.jsx')
                    return {element: <InfoFaqBB/>}
                }
            },
            {
                path: '/scorecard/info/howto',
                lazy: async () => {
                    const {default: HowToPage} = await import('../scorecard/HowToPage.jsx')
                    return {element: <HowToPage/>}
                }
            },
        ]
    },
    {
        path: '/leaderboard',
        lazy: async () => {
            const {default: LeaderboardRoute} = await import('../leaderboard/LeaderboardRoute')
            return {element: <LeaderboardRoute/>}
        },
        children: [
            {
                path: '/leaderboard/locks',
                lazy: async () => {
                    const {default: Leaderboard} = await import('../leaderboard/Leaderboard')
                    return {element: <Leaderboard tab={'locks'}/>}
                }
            },
            {
                path: '/leaderboard/safelocks',
                lazy: async () => {
                    const {default: Leaderboard} = await import('../leaderboard/Leaderboard')
                    return {element: <Leaderboard tab={'safelocks'}/>}
                }
            },
            {
                path: '/leaderboard/blackBelts',
                lazy: async () => {
                    const {default: Leaderboard} = await import('../leaderboard/Leaderboard')
                    return {element: <Leaderboard tab={'blackBelts'}/>}
                }
            }
        ]
    },
    {
        path: '/info',
        lazy: async () => {
            const {default: InfoRoute} = await import('../info/InfoRoute')
            return {element: <InfoRoute/>}
        }
    },
    {
        path: '/dans',
        lazy: async () => {
            const {default: DansRoute} = await import('../info/DansRoute')
            return {element: <DansRoute/>}
        }
    },{
        path: '/projects',
        lazy: async () => {
            const {default: ProjectsRoute} = await import('../info/ProjectsRoute')
            return {element: <ProjectsRoute/>}
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
            },
            {
                path: '/admin/siteReport',
                lazy: async () => {
                    const {default: SiteReportMain} = await import('../admin/SiteReportMain')
                    return {element: <SiteReportMain/>}
                }
            },
            {
                path: '/admin/blackBelts',
                lazy: async () => {
                    const {default: BlackBeltsMain} = await import('../admin/BlackBeltsMain')
                    return {element: <BlackBeltsMain/>}
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
        path: '/profile/:userId/scorecard',
        lazy: async() => {
            const {default: ScorecardRoute} = await import('../scorecard/ScorecardRoute')
            return {element: <ScorecardRoute/>}
        }
    },
    {
        path: '/profile/scorecard/upgrades',
        lazy: async() => {
            const {default: UpgradesRoute} = await import('../scorecard/UpgradesRoute')
            return {element: <UpgradesRoute/>}
        }
    },
    {
        path: '/profile/scorecard/howto',
        lazy: async() => {
            const {default: HowToRoute} = await import('../scorecard/HowToRoute')
            return {element: <HowToRoute/>}
        }
    },
    {
        path: '/profile/:userId/safelocks',
        lazy: async() => {
            const {default: SafelocksCollectionRoute} = await import('../safelocksCollection/SafelocksCollectionRoute')
            return {element: <SafelocksCollectionRoute/>}
        }
    },
    {
        path: '/profile/view',
        lazy: async () => {
            const {default: ViewProfileRoute} = await import('../profile/ViewProfileRoute')
            return {element: <ViewProfileRoute/>}
        }
    },
    {
        path: '/profile/view/scorecard',
        lazy: async () => {
            const {default: ViewScorecardRoute} = await import('../scorecard/ViewScorecardRoute')
            return {element: <ViewScorecardRoute/>}
        }
    },{
        path: '/profile/scorecard',
        lazy: async () => {
            const {default: ViewScorecardRoute} = await import('../scorecard/ViewScorecardRoute')
            return {element: <ViewScorecardRoute/>}
        }
    },{
        path: '/profile/scorecard/preview',
        lazy: async () => {
            const {default: PreviewImportRoute} = await import('../scorecard/preview/PreviewImportRoute')
            return {element: <PreviewImportRoute/>}
        }
    },
    {
        path: '/safelocks',
        lazy: async () => {
            const {default: SafelocksRoute} = await import('../safelocks/SafelocksRoute.jsx')
            return {element: <SafelocksRoute/>}
        }
    },
    {
        path: '/dials',
        lazy: async () => {
            const {default: SafelocksRoute} = await import('../safelocks/SafelocksRoute.jsx')
            return {element: <SafelocksRoute/>}
        }
    },{
        path: '/award',
        lazy: async () => {
            const {default: AwardRoute} = await import('../award/AwardRoute.jsx')
            return {element: <AwardRoute/>}
        }
    },
    {
        path: '*',
        loader: () => redirect('/locks')
    },
].map(route => ({...route, errorElement: <ErrorBoundary/>}))

