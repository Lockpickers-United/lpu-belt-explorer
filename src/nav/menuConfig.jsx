import React from 'react'
import HomeIcon from '@mui/icons-material/Home'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import FeedIcon from '@mui/icons-material/Feed'

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
        beta: true,
        title: 'About LPU Belts',
        icon: <FeedIcon fontSize='small'/>,
        path: '/about'
    }
]
