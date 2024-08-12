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
        title: 'Dan System',
        icon: <SportsMartialArtsIcon fontSize='small'/>,
        path: '/dans'
    },
    {
        title: "Master's Projects",
        icon: <ConstructionIcon fontSize='small'/>,
        path: '/projects'
    },
    {
        title: 'Glossary',
        icon: <MenuBookIcon fontSize='small'/>,
        path: '/glossary'
    },
    {
        beta: true,
        title: 'Safe Locks',
        icon: <AvTimerIcon fontSize='small'/>,
        path: '/safelocks'
    },
    {
        title: 'Stats & Insights',
        icon: <InsertChartOutlinedIcon fontSize='small'/>,
        path: '/stats'
    },
    {
        title: 'Leaderboard',
        icon: <LeaderboardIcon fontSize='small'/>,
        path: '/leaderboard'
    },
    {
        title: 'About LPU Belts',
        icon: <FeedIcon fontSize='small'/>,
        path: '/about'
    },
    {
        admin: true,
        title: 'Admin Tools',
        icon: <BuildIcon fontSize='small'/>,
        path: '/admin',
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
                title: 'Black Belt Report',
                path: '/admin/blackBelts'
            }
        ]
    },
    {
        title: 'More from LPU',
        icon: <LPU_logo style={{height:20}}/>,
        expanded: true,
        children: [
            {
                title: 'LPUlocks.com Lock Bazaar',
                path: 'https://lpulocks.com/#/lockbazaar'
            },
            {
                title: 'LPUlocks.com Speed Picks',
                path: 'https://lpulocks.com/#/speedpicks'
            }
        ]
    }
]
