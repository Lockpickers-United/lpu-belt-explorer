import React from 'react'
import HomeIcon from '@mui/icons-material/Home'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import FeedIcon from '@mui/icons-material/Feed'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import BuildIcon from '@mui/icons-material/Build'

export default [
    {
        title: 'Lock List',
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
        icon: <InsightsOutlinedIcon fontSize='small'/>,
        path: '/dans'
    },
    {
        title: 'Glossary',
        icon: <MenuBookIcon fontSize='small'/>,
        path: '/glossary'
    },
    {
        title: 'Stats & Insights',
        icon: <InsertChartOutlinedIcon/>,
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
            }, {
                admin: true,
                title: 'Collections Report',
                path: '/admin/collectionsReport'
            }
        ]
    }
]
