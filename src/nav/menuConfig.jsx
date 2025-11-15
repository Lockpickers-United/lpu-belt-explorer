import React from 'react'
import HomeIcon from '@mui/icons-material/Home'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import FeedIcon from '@mui/icons-material/Feed'
import BuildIcon from '@mui/icons-material/Build'
import AvTimerIcon from '@mui/icons-material/AvTimer'
import LPU_logo from '../resources/LPU_logo'
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts'
import ConstructionIcon from '@mui/icons-material/Construction'
import NewReleasesIcon from '@mui/icons-material/NewReleases'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption'
import CampaignIcon from '@mui/icons-material/Campaign'
import AssessmentIcon from '@mui/icons-material/Assessment'
import TurnSharpRightIcon from '@mui/icons-material/TurnSharpRight'

const {VITE_RAFL_STATE: raflState} = import.meta.env

export default [
    {
        title: 'Locks',
        icon: <HomeIcon fontSize='small'/>,
        path: '/locks',
        params: {
            tab: 'White',
            search: undefined,
            id: undefined,
            name: undefined
        }
    },
    {
        title: 'Belt Requirements',
        icon: <InfoOutlinedIcon fontSize='small'/>,
        path: '/info'
    },
    {
        title: 'Safe Locks',
        icon: <AvTimerIcon fontSize='small'/>,
        path: '/safelocks'
    },
    {
        title: 'RAFL',
        icon: <NewReleasesIcon fontSize='small'/>,
        path: '/rafl',
        hidden: raflState === 'hidden' || raflState === 'setup',
    },
    {
        title: 'RAFL pot contribution',
        icon: <NewReleasesIcon fontSize='small'/>,
        path: '/rafl/contribute',
        beta: true
    },
    {
        title: 'Leaderboards',
        icon: <LeaderboardIcon fontSize='small'/>,
        path: '/leaderboard',
        expanded: true,
        children: [
            {
                title: 'Locks',
                path: '/leaderboard/locks'
            },
            {
                title: 'Safe Locks',
                path: '/leaderboard/safelocks'
            },
            {
                title: 'Black Belts',
                path: '/leaderboard/blackBelts'
            },
            {
                title: 'Recent Belts & Picks',
                path: '/leaderboard/recent'
            }
        ]
    },
    {
        title: 'Glossary',
        icon: <MenuBookIcon fontSize='small'/>,
        path: '/glossary'
    },
    {
        title: 'Dan System',
        icon: <SportsMartialArtsIcon fontSize='small'/>,
        path: '/dans'
    },
    {
        title: 'Master\'s Projects',
        icon: <ConstructionIcon fontSize='small'/>,
        path: '/projects'
    },
    {
        title: 'Stats & Insights',
        icon: <InsertChartOutlinedIcon fontSize='small'/>,
        path: '/stats'
    },
    {
        title: 'More Scorecard Stats',
        icon: <InsertChartOutlinedIcon fontSize='small'/>,
        path: '/explore',
    },
    {
        title: 'Path To Black',
        icon: <TurnSharpRightIcon fontSize='small'/>,
        path: '/pathtoblack',
    },
    {
        title: 'Contribute Photos',
        icon: <CameraAltIcon fontSize='small'/>,
        path: '/content',
    },
    {
        title: 'Request a Lock',
        icon: <EnhancedEncryptionIcon fontSize='small'/>,
        path: '/rankingrequests/submit',
    },
    {
        title: 'Recent Changes',
        icon: <ChangeCircleIcon fontSize='small'/>,
        path: '/recent',
        beta: true
    },
    {
        title: 'About LPU Belts',
        icon: <FeedIcon fontSize='small'/>,
        path: '/about'
    },
    {
        title: 'Admin Tools',
        icon: <BuildIcon fontSize='small'/>,
        path: '/tools',
        userClaims: ['admin', 'lpuAdmin'],
    },
    {
        title: 'Reports',
        icon: <AssessmentIcon fontSize='small'/>,
        path: '/admin',
        userClaims: ['admin', 'lpuAdmin'],
        children: [
            {
                admin: true,
                title: 'Site Report',
                path: '/admin/siteReport'
            },
            {
                admin: true,
                title: 'Collections Report',
                path: '/admin/collectionsReport'
            },
            {
                admin: true,
                title: 'Firebase Report',
                path: '/admin/firebaseReport'
            },
            {
                admin: true,
                title: 'RAFL Report',
                path: '/rafl/reports'
            },
            {
                admin: true,
                title: 'Black Belt Report',
                path: '/admin/blackBelts'
            }
        ]
    },
    {
        title: 'System Message Admin',
        icon: <CampaignIcon fontSize='small'/>,
        path: '/admin/systemMessages',
        admin: true,
    },
    {
        title: 'More from LPUlocks.com',
        icon: <LPU_logo style={{height: 20}}/>,
        expanded: true,
        separator: true,
        children: [
            {
                title: 'Lock Bazaar Browser',
                path: 'https://lpulocks.com/#/lockbazaar'
            },
            {
                title: 'Speed Picks',
                path: 'https://lpulocks.com/#/speedpicks'
            },
            {
                title: 'Challenge Locks',
                path: 'https://lpulocks.com/#/challengelocks'
            }
        ]
    }
]
