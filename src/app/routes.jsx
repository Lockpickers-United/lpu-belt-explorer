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
        path: '/auth/discord',
        lazy: async () => {
            const {default: AuthDiscordRoute} = await import ('../auth/AuthDiscordRoute')
            return {element: <AuthDiscordRoute/>}
        }
    },
    {
        path: '/_',
        lazy: async () => {
            const {default: AuthRedditRoute} = await import ('../auth/AuthRedditRoute')
            return {element: <AuthRedditRoute/>}
        }
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
            }
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
            },
            {
                path: '/leaderboard/recent',
                lazy: async () => {
                    const {default: Leaderboard} = await import('../leaderboard/Leaderboard')
                    return {element: <Leaderboard tab={'recent'}/>}
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
        path: '/beltsMarkdown',
        lazy: async () => {
            const {default: BeltsMarkdownRoute} = await import('../info/BeltsMarkdownRoute')
            return {element: <BeltsMarkdownRoute/>}
        }
    },
    {
        path: '/dans',
        lazy: async () => {
            const {default: DansRoute} = await import('../info/DansRoute')
            return {element: <DansRoute/>}
        }
    }, {
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
                    const {default: SiteReportMain} = await import('../admin/siteReport/SiteReportMain.jsx')
                    return {element: <SiteReportMain/>}
                }
            },
            {
                path: '/admin/firebaseReport',
                lazy: async () => {
                    const {default: FirebaseReport} = await import('../admin/firebaseReport/FirebaseReport')
                    return {element: <FirebaseReport/>}
                }
            },
            {
                path: '/admin/blackBelts',
                lazy: async () => {
                    const {default: BlackBeltsMain} = await import('../admin/BlackBeltsMain')
                    return {element: <BlackBeltsMain/>}
                }
            },
            {
                path: '/admin/systemMessages',
                lazy: async () => {
                    const {default: SystemMessageAdmin} = await import('../admin/SystemMessageAdmin')
                    return {element: <SystemMessageAdmin/>}
                }
            },
            {
                path: '/admin/testing',
                lazy: async () => {
                    const {default: TestingMain} = await import('../admin/TestingMain')
                    return {element: <TestingMain/>}
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
        lazy: async () => {
            const {default: ScorecardRoute} = await import('../scorecard/ScorecardRoute')
            return {element: <ScorecardRoute/>}
        }
    },
    {
        path: '/profile/:userId/scorecard/popular',
        lazy: async () => {
            const {default: ScorecardRoute} = await import('../scorecard/ScorecardRoute')
            return {element: <ScorecardRoute mostPopular={true}/>}
        }
    },
    {
        path: '/profile/:userId/scorecard/no-tracking',
        lazy: async () => {
            const {default: ScorecardNoTrackRoute} = await import('../scorecard/noTrack/ScorecardNoTrackRoute.jsx')
            return {element: <ScorecardNoTrackRoute/>}
        }
    },
    {
        path: '/profile/scorecard/upgrades',
        lazy: async () => {
            const {default: UpgradesRoute} = await import('../scorecard/UpgradesRoute')
            return {element: <UpgradesRoute/>}
        }
    },
    {
        path: '/profile/scorecard/howto',
        lazy: async () => {
            const {default: HowToRoute} = await import('../scorecard/HowToRoute')
            return {element: <HowToRoute/>}
        }
    },
    {
        path: '/profile/:userId/safelocks',
        lazy: async () => {
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
    },
    {
        path: '/profile/scorecard',
        lazy: async () => {
            const {default: ViewScorecardRoute} = await import('../scorecard/ViewScorecardRoute')
            return {element: <ViewScorecardRoute/>}
        }
    },
    {
        path: '/profile/scorecard/popular',
        lazy: async () => {
            const {default: ViewScorecardRoute} = await import('../scorecard/ViewScorecardRoute')
            return {element: <ViewScorecardRoute mostPopular={true}/>}
        }
    },
    {
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
    },
    {
        path: '/award',
        lazy: async () => {
            const {default: AwardRoute} = await import('../award/AwardRoute.jsx')
            return {element: <AwardRoute/>}
        }
    },
    {
        path: '/pathtoblack',
        lazy: async () => {
            const {default: PathToBlackRoute} = await import('../pathToBlack/PathToBlackRoute.jsx')
            return {element: <PathToBlackRoute/>}
        }
    },
    {
        path: '/content',
        lazy: async () => {
            const {default: ContentParentRoute} = await import('../content/ContentParentRoute.jsx')
            return {element: <ContentParentRoute/>}
        },
        children: [
            {
                path: '/content',
                lazy: async () => {
                    const {default: PhotoSubmitRoute} = await import('../content/photoSubmit/PhotoSubmitRoute.jsx')
                    return {element: <PhotoSubmitRoute/>}
                }
            },
            {
                path: '/content/photos',
                lazy: async () => {
                    const {default: PhotoSubmitRoute} = await import('../content/photoSubmit/PhotoSubmitRoute.jsx')
                    return {element: <PhotoSubmitRoute/>}
                }
            }
        ]
    },
    {
        path: '/rankingrequests',
        lazy: async () => {
            const {default: RankingRequestsParentRoute} = await import('../rankingRequests/RankingRequestsParentRoute.jsx')
            return {element: <RankingRequestsParentRoute/>}
        },
        children: [
            {
                path: '/rankingrequests',
                lazy: async () => {
                    const {default: RequestLockRoute} = await import('../rankingRequests/RequestLockRoute.jsx')
                    return {element: <RequestLockRoute/>}
                }
            },
            {
                path: '/rankingrequests/submit',
                lazy: async () => {
                    const {default: RequestLockRoute} = await import('../rankingRequests/RequestLockRoute.jsx')
                    return {element: <RequestLockRoute/>}
                }
            },
            {
                path: '/rankingrequests/view',
                lazy: async () => {
                    const {default: ViewLockRequestsRoute} = await import('../rankingRequests/ViewLockRequestsRoute.jsx')
                    return {element: <ViewLockRequestsRoute/>}
                }
            }
        ]
    },
    {
        path: '/rafl',
        lazy: async () => {
            const {default: RaffleParentRoute} = await import('../rafl/RaffleParentRoute.jsx')
            return {element: <RaffleParentRoute/>}
        },
        children: [
            {
                path: '/rafl',
                lazy: async () => {
                    const {default: RaffleRoute} = await import('../rafl/RaffleRoute.jsx')
                    return {element: <RaffleRoute/>}
                }
            },
            {
                path: '/rafl/charities',
                lazy: async () => {
                    const {default: RaffleCharitiesRoute} = await import('../rafl/RaffleCharitiesRoute.jsx')
                    return {element: <RaffleCharitiesRoute/>}
                }
            },
            {
                path: '/rafl/enter',
                lazy: async () => {
                    const {default: RaffleEnterAboutRoute} = await import('../rafl/RaffleEnterAboutRoute.jsx')
                    return {element: <RaffleEnterAboutRoute/>}
                }
            },
            {
                path: '/rafl/entryform',
                lazy: async () => {
                    const {default: RaffleEntryFormRoute} = await import('../rafl/entryForm/RaffleEntryFormRoute.jsx')
                    return {element: <RaffleEntryFormRoute/>}
                }
            },
            {
                path: '/rafl/reports',
                lazy: async () => {
                    const {default: RaffleReportRoute} = await import('../rafl/reports/RaffleReportRoute.jsx')
                    return {element: <RaffleReportRoute/>}
                }
            },
            {
                path: '/rafl/announce',
                lazy: async () => {
                    const {default: RaffleAnnounceRoute} = await import('../rafl/RaffleAnnounceRoute.jsx')
                    return {element: <RaffleAnnounceRoute/>}
                }
            },
            {
                path: '/rafl/stats',
                lazy: async () => {
                    const {default: RaffleStatsRoute} = await import('../rafl/RaffleStatsRoute.jsx')
                    return {element: <RaffleStatsRoute/>}
                }
            }
        ]
    }, {
        path: '/tools',
        lazy: async () => {
            const {default: ToolsParentRoute} = await import('../tools/ToolsParentRoute.jsx')
            return {element: <ToolsParentRoute/>}
        },
        children: [
            {
                path: '/tools',
                lazy: async () => {
                    const {default: ToolsRoute} = await import('../tools/ToolsRoute.jsx')
                    return {element: <ToolsRoute/>}
                }
            }, {
                path: '/tools/flickrinfo',
                lazy: async () => {
                    const {default: FlickrInfoRoute} = await import('../tools/flickrInfo/FlickrInfoRoute.jsx')
                    return {element: <FlickrInfoRoute/>}
                }
            }, {
                path: '/tools/rafl-charities',
                lazy: async () => {
                    const {default: RaflCharitiesRoute} = await import('../tools/raflCharities/RaflCharitiesRoute.jsx')
                    return {element: <RaflCharitiesRoute/>}
                }
            }, {
                path: '/tools/testpage',
                lazy: async () => {
                    const {default: TestPageRoute} = await import('../tools/testPage/TestPageRoute.jsx')
                    return {element: <TestPageRoute/>}
                }
            }, {
                path: '/tools/reddit-belts',
                lazy: async () => {
                    const {default: FetchRedditBeltsRoute} = await import('../tools/fetchRedditBelts/FetchRedditBeltsRoute.jsx')
                    return {element: <FetchRedditBeltsRoute/>}
                }
            }
        ]
    },
    {
        path: '/beta',
        lazy: async () => {
            const {default: BetaToggleRoute} = await import('../tools/betaToggle/BetaToggleRoute.jsx')
            return {element: <BetaToggleRoute/>}
        }
    },
    {
        path: '/evidence-review',
        lazy: async () => {
            const {default: EvidenceReviewRoute} = await import('../tools/evidenceReview/EvidenceReviewRoute.jsx')
            return {element: <EvidenceReviewRoute/>}
        }
    },
    {
        path: '/recent',
        lazy: async () => {
            const {default: RecentChangesRoute} = await import('../tools/recent/RecentChangesRoute.jsx')
            return {element: <RecentChangesRoute/>}
        }
    },
    {
        path: '/view',
        lazy: async () => {
            const {default: ViewPageRoute} = await import('../viewPage/ViewPageRoute.jsx')
            return {element: <ViewPageRoute/>}
        }
    },
    {
        path: '/explore',
        lazy: async () => {
            const {default: ScorecardExploreRoute} = await import('../scorecard/explore/ScorecardExploreRoute.jsx')
            return {element: <ScorecardExploreRoute/>}
        }
    },
    {
        path: '/userinfo',
        lazy: async () => {
            const {default: UserInfoRoute} = await import('../userinfo/UserInfoRoute.jsx')
            return {element: <UserInfoRoute/>}
        }
    },
    {
        path: '/usage',
        lazy: async () => {
            const {default: UsageRoute} = await import('../info/UsageRoute.jsx')
            return {element: <UsageRoute/>}
        }
    },
    {
        path: '*',
        loader: () => redirect('/locks')
    },

    {
        path: '*',
        loader:
            () => redirect('/locks')
    }
].map(route => ({...route, errorElement: <ErrorBoundary/>}))

